import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { DriverRepository } from "../../../../application/repositories/DriverRepository.ts";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddDriverUsecase } from "../../../../application/usecases/driver/AddDriverUsecase.ts";
import { GetDriverUsecase } from "../../../../application/usecases/driver/GetDriverUsecase.ts";
import { ListDriversUsecase } from "../../../../application/usecases/driver/ListDriversUsecase.ts";
import { UpdateDriverUsecase } from "../../../../application/usecases/driver/UpdateDriverUsecase.ts";
import { DeleteDriverUsecase } from "../../../../application/usecases/driver/DeleteDriverUsecase.ts";
import { addDriverRequestSchema, updateDriverRequestSchema } from "../schemas/driverRequestSchema.ts";

export class DriverController {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listDriversUsecase = new ListDriversUsecase(this.driverRepository);
    const result = await listDriversUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Driver ID is required" }, 400);
    }

    const getDriverUsecase = new GetDriverUsecase(this.driverRepository);
    const result = await getDriverUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive("DriverNotFoundError", {
      DriverNotFoundError: () => context.json({ message: "Driver not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addDriverRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addDriverUsecase = new AddDriverUsecase(
      this.driverRepository,
      this.motorcycleRepository
    );
    const result = await addDriverUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive("EnterpriseNotFoundError", {
      EnterpriseNotFoundError: () => context.json({ message: "Enterprise not found" }, 404),
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Driver ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateDriverRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateDriverUsecase = new UpdateDriverUsecase(this.driverRepository);
    const result = await updateDriverUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive("DriverNotFoundError", {
      DriverNotFoundError: () => context.json({ message: "Driver not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Driver ID is required" }, 400);
    }

    const deleteDriverUsecase = new DeleteDriverUsecase(this.driverRepository);
    const result = await deleteDriverUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive("DriverNotFoundError", {
      DriverNotFoundError: () => context.json({ message: "Driver not found" }, 404),
    });
  }
}