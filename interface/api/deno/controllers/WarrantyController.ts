import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { WarrantyRepository } from "../../../../application/repositories/WarrantyRepository.ts";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddWarrantyUsecase } from "../../../../application/usecases/warranty/AddWarrantyUsecase.ts";
import { GetWarrantyUsecase } from "../../../../application/usecases/warranty/GetWarrantyUsecase.ts";
import { ListWarrantiesUsecase } from "../../../../application/usecases/warranty/ListWarrantiesUsecase.ts";
import { UpdateWarrantyUsecase } from "../../../../application/usecases/warranty/UpdateWarrantyUsecase.ts";
import { DeleteWarrantyUsecase } from "../../../../application/usecases/warranty/DeleteWarrantyUsecase.ts";
import { addWarrantyRequestSchema, updateWarrantyRequestSchema } from "../schemas/warrantyRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class WarrantyController implements EntityControllerInterface{
  constructor(
    private readonly warrantyRepository: WarrantyRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listWarrantiesUsecase = new ListWarrantiesUsecase(this.warrantyRepository);
    const result = await listWarrantiesUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Warranty ID is required" }, 400);
    }

    const getWarrantyUsecase = new GetWarrantyUsecase(this.warrantyRepository);
    const result = await getWarrantyUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      WarrantyNotFoundError: () => context.json({ message: "Warranty not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addWarrantyRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addWarrantyUsecase = new AddWarrantyUsecase(
      this.warrantyRepository,
      this.motorcycleRepository
    );
    const result = await addWarrantyUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404),
      InvalidDateError: () => context.json({ message: "Invalid date" }, 400),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Warranty ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateWarrantyRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateWarrantyUsecase = new UpdateWarrantyUsecase(
      this.warrantyRepository,
      this.motorcycleRepository
    );
    const result = await updateWarrantyUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      WarrantyNotFoundError: () => context.json({ message: "Warranty not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Warranty ID is required" }, 400);
    }

    const deleteWarrantyUsecase = new DeleteWarrantyUsecase(this.warrantyRepository);
    const result = await deleteWarrantyUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      WarrantyNotFoundError: () => context.json({ message: "Warranty not found" }, 404),
    });
  }
}
