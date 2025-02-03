import type { MaintenanceRepository } from "../../../../application/repositories/MaintenanceRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddMaintenanceUsecase } from "../../../../application/usecases/maintenance/AddMaintenanceUsecase.ts";
import { GetMaintenanceUsecase } from "../../../../application/usecases/maintenance/GetMaintenanceUsecase.ts";
import { ListMaintenancesUsecase } from "../../../../application/usecases/maintenance/ListMaintenancesUsecase.ts";
import { UpdateMaintenanceUsecase } from "../../../../application/usecases/maintenance/UpdateMaintenanceUsecase.ts";
import { DeleteMaintenanceUsecase } from "../../../../application/usecases/maintenance/DeleteMaintenanceUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { addMaintenanceRequestSchema, updateMaintenanceRequestSchema } from "../schemas/maintenanceRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { MaintenanceEntity } from "../../../../domain/entities/MaintenanceEntity.ts";

export class MaintenanceController implements EntityControllerInterface {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listMaintenancesUsecase = new ListMaintenancesUsecase(this.maintenanceRepository);

    const result = await listMaintenancesUsecase.execute();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Maintenance ID is required", { status: 400 });
    }

    const getMaintenanceUsecase = new GetMaintenanceUsecase(this.maintenanceRepository);

    const result = await getMaintenanceUsecase.execute(id);

    if (result instanceof MaintenanceEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      MaintenanceNotFoundError: () => new Response("MaintenanceNotFoundError", { status: 404 }),
    });
  }

  public async create(request: Request): Promise<Response> {
    const addMaintenanceUsecase = new AddMaintenanceUsecase(
      this.maintenanceRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = addMaintenanceRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { date, description, motorcycleId, cost } = validation.data;

    const result = await addMaintenanceUsecase.execute({
      date,
      description,
      motorcycleId,
      cost,
    });

    if (result instanceof MaintenanceEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const maintenanceId = url.searchParams.get("id");

    if (!maintenanceId) {
      return new Response("Maintenance ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateMaintenanceRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(this.maintenanceRepository, this.motorcycleRepository);
    const result = await updateMaintenanceUsecase.execute(maintenanceId, validation.data);

    if (result instanceof MaintenanceEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      MaintenanceNotFoundError: () => new Response("MaintenanceNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
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
      return new Response(null, { status: 204 });
    }

    return exhaustive(result.name, {
      MaintenanceNotFoundError: () => new Response("MaintenanceNotFoundError", { status: 404 }),
    });
  }
}
