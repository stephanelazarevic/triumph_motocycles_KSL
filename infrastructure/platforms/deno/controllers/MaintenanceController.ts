import type { MaintenanceRepository } from "../../../../application/repositories/MaintenanceRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateMaintenanceUsecase } from "../../../../application/usecases/CreateMaintenanceUsecase.ts";
import { ListMaintenancesUsecase } from "../../../../application/usecases/ListMaintenancesUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createMaintenanceRequestSchema } from "../schemas/createMaintenanceRequestSchema.ts";

export class MaintenanceController {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async listMaintenances(): Promise<Response> {
    const listMaintenancesUsecase = new ListMaintenancesUsecase(
      this.maintenanceRepository,
    );

    const maintenances = await listMaintenancesUsecase.execute();

    return new Response(JSON.stringify(maintenances), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async createMaintenance(request: Request): Promise<Response> {
    const createMaintenanceUsecase = new CreateMaintenanceUsecase(
      this.maintenanceRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = createMaintenanceRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { date, description, motorcycleId, cost } = validation.data;

    const error = await createMaintenanceUsecase.execute(date, description, motorcycleId, cost);

    if (!error) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(error.name, {
      AppointmentDatePastError: () => new Response("AppointmentDatePastError", { status: 400 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 400 }),
    });
  }
}
