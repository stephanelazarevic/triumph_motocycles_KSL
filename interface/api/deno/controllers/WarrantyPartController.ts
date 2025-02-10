import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { WarrantyPartRepository } from "../../../../application/repositories/WarrantyPartRepository.ts";
import { WarrantyRepository } from "../../../../application/repositories/WarrantyRepository.ts";
import { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { AddWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/AddWarrantyPartUsecase.ts";
import { GetWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/GetWarrantyPartUsecase.ts";
import { ListWarrantyPartsUsecase } from "../../../../application/usecases/warrantyPart/ListWarrantyPartsUsecase.ts";
import { UpdateWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/UpdateWarrantyPartUsecase.ts";
import { DeleteWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/DeleteWarrantyPartUsecase.ts";
import { addWarrantyPartRequestSchema, updateWarrantyPartRequestSchema } from "../schemas/warrantyPartRequestSchema.ts";
import { WarrantyPartEntity } from "../../../../domain/entities/WarrantyPartEntity.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class WarrantyPartController implements EntityControllerInterface{
  constructor(
    private readonly warrantyPartRepository: WarrantyPartRepository,
    private readonly warrantyRepository: WarrantyRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const usecase = new ListWarrantyPartsUsecase(this.warrantyPartRepository);
    const result = await usecase.execute();

    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "WarrantyPart ID is required" }, 400);
    }
    const usecase = new GetWarrantyPartUsecase(this.warrantyPartRepository);
    const result = await usecase.execute(id);
    if (result) {
      return context.json(JSON.stringify(result), 200);
    }
    return exhaustive({
      WarrantyPartNotFoundError: () => context.json({ message: "WarrantyPart not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addWarrantyPartRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }
    const usecase = new AddWarrantyPartUsecase(this.warrantyPartRepository, this.warrantyRepository, this.partRepository);
    const result = await usecase.execute(validation.data);
    if (result instanceof WarrantyPartEntity) {
      return context.json(JSON.stringify(result), 201);
    }
    return exhaustive({
      WarrantyNotFoundError: () => context.json({ message: "Warranty not found" }, 404),
      PartNotFoundError: () => context.json({ message: "Part not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "WarrantyPart ID is required" }, 400);
    }
    const body = await context.req.json();
    const validation = updateWarrantyPartRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }
    const usecase = new UpdateWarrantyPartUsecase(this.warrantyPartRepository, this.warrantyRepository, this.partRepository);
    const result = await usecase.execute(id, validation.data);
    if (result instanceof WarrantyPartEntity) {
      return context.json(JSON.stringify(result), 200);
    }
    return exhaustive({
      WarrantyPartNotFoundError: () => context.json({ message: "WarrantyPart not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "WarrantyPart ID is required" }, 400);
    }
    const usecase = new DeleteWarrantyPartUsecase(this.warrantyPartRepository);
    const result = await usecase.execute(id);
    if (!result) {
      return context.json(null, 204);
    }
    return exhaustive({
      WarrantyPartNotFoundError: () => context.json({ message: "WarrantyPart not found" }, 404),
    });
  }
}