import type { MaintenanceRepository } from "../../../../application/repositories/MaintenanceRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateMaintenanceUsecase } from "../../../../application/usecases/maintenance/CreateMaintenanceUsecase.ts";
import { FindMaintenanceUsecase } from "../../../../application/usecases/maintenance/FindMaintenanceUsecase.ts";
import { FindAllMaintenancesUsecase } from "../../../../application/usecases/maintenance/FindAllMaintenancesUsecase.ts";
import { UpdateMaintenanceUsecase } from "../../../../application/usecases/maintenance/UpdateMaintenanceUsecase.ts";
import { DeleteMaintenanceUsecase } from "../../../../application/usecases/maintenance/DeleteMaintenanceUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { createMaintenanceRequestSchema } from "../schemas/createMaintenanceRequestSchema.ts";
import { MaintenanceNotFoundError } from "../../../../domain/errors/MaintenanceNotFoundError.ts";

export class MaintenanceController {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAllMaintenances(): Promise<Response> {
    const listMaintenancesUsecase = new FindAllMaintenancesUsecase(
      this.maintenanceRepository,
    );

    const result = await listMaintenancesUsecase.execute();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getMaintenanceById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Maintenance ID is required", { status: 400 });
    }

    const findMaintenanceUsecase = new FindMaintenanceUsecase(
      this.maintenanceRepository,
    );

    const result = await findMaintenanceUsecase.execute(id);

    if (result instanceof MaintenanceNotFoundError) {
      return new Response("MaintenanceNotFoundError", { status: 404 });
    }

    if (typeof result === "object" && result !== null) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive({
      MaintenanceNotFoundError: () => new Response("MaintenanceNotFoundError", { status: 404 }),
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

  public async updateMaintenance(request: Request): Promise<Response> {
    const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(
      this.maintenanceRepository,
    );

    const body = await request.json();

    const validation = createMaintenanceRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await updateMaintenanceUsecase.execute(validation.data);

    if (result === undefined) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      MaintenanceNotFoundError: () => new Response("MaintenanceNotFoundError", { status: 400 }),
    });
  }

  public async deleteMaintenance(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Maintenance ID is required", { status: 400 });
    }

    const deleteMaintenanceUsecase = new DeleteMaintenanceUsecase(
      this.maintenanceRepository,
    );

    const result = await deleteMaintenanceUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      MaintenanceNotFoundError: () => new Response("MaintenanceNotFoundError", { status: 400 }),
    });
  }
}
