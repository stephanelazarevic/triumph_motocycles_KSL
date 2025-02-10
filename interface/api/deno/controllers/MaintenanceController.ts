import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MaintenanceRepository } from "../../../../application/repositories/MaintenanceRepository.ts";
import { AddMaintenanceUsecase } from "../../../../application/usecases/maintenance/AddMaintenanceUsecase.ts";
import { GetMaintenanceUsecase } from "../../../../application/usecases/maintenance/GetMaintenanceUsecase.ts";
import { ListMaintenancesUsecase } from "../../../../application/usecases/maintenance/ListMaintenancesUsecase.ts";
import { UpdateMaintenanceUsecase } from "../../../../application/usecases/maintenance/UpdateMaintenanceUsecase.ts";
import { DeleteMaintenanceUsecase } from "../../../../application/usecases/maintenance/DeleteMaintenanceUsecase.ts";
import { addMaintenanceRequestSchema, updateMaintenanceRequestSchema } from "../schemas/maintenanceRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class MaintenanceController implements EntityControllerInterface{
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listMaintenancesUsecase = new ListMaintenancesUsecase(this.maintenanceRepository);
    const result = await listMaintenancesUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Maintenance ID is required" }, 400);
    }

    const getMaintenanceUsecase = new GetMaintenanceUsecase(this.maintenanceRepository);
    const result = await getMaintenanceUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      MaintenanceNotFoundError: () => context.json({ message: "Maintenance not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addMaintenanceRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addMaintenanceUsecase = new AddMaintenanceUsecase(this.maintenanceRepository);
    const result = await addMaintenanceUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Maintenance ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateMaintenanceRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(this.maintenanceRepository);
    const result = await updateMaintenanceUsecase.execute(id, validation.data);

    if (result) {
      return context.json(result, 200);
    }

    return exhaustive({
      MaintenanceNotFoundError: () => context.json({ message: "Maintenance not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Maintenance ID is required" }, 400);
    }

    const deleteMaintenanceUsecase = new DeleteMaintenanceUsecase(this.maintenanceRepository);
    const result = await deleteMaintenanceUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      MaintenanceNotFoundError: () => context.json({ message: "Maintenance not found" }, 404),
    });
  }
}
