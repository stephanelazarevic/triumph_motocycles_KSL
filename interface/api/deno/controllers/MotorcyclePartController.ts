import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { MotorcyclePartRepository } from "../../../../application/repositories/MotorcyclePartRepository.ts";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { addMotorcyclePartRequestSchema, updateMotorcyclePartRequestSchema } from "../schemas/motorcyclePartRequestSchema.ts";
import { ListMotorcyclePartsUsecase } from "../../../../application/usecases/motorcyclePart/ListMotorcyclePartsUsecase.ts";
import { AddMotorcyclePartUsecase } from "../../../../application/usecases/motorcyclePart/AddMotorcyclePartUsecase.ts";
import { GetMotorcyclePartUsecase } from "../../../../application/usecases/motorcyclePart/GetMotorcyclePartUsecase.ts";
import { UpdateMotorcyclePartsUsecase } from "../../../../application/usecases/motorcyclePart/UpdateMotorcyclePartsUsecase.ts";
import { DeleteMotorcyclePartUsecase } from "../../../../application/usecases/motorcyclePart/DeleteMotorcyclePartUsecase.ts";

export class MotorcyclePartController {
  constructor(
    private readonly motorcyclePartRepository: MotorcyclePartRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listMotorcyclePartsUsecase = new ListMotorcyclePartsUsecase(
      this.motorcyclePartRepository
    );
    const result = await listMotorcyclePartsUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "MotorcyclePart ID is required" }, 400);
    }

    const getMotorcyclePartUsecase = new GetMotorcyclePartUsecase(
      this.motorcyclePartRepository
    );
    const result = await getMotorcyclePartUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      MotorcyclePartNotFoundError: () => context.json({ message: "Motorcycle part not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addMotorcyclePartRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addMotorcyclePartUsecase = new AddMotorcyclePartUsecase(
      this.motorcyclePartRepository,
      this.motorcycleRepository,
      this.partRepository
    );
    const result = await addMotorcyclePartUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404),
      PartNotFoundError: () => context.json({ message: "Part not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "MotorcyclePart ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateMotorcyclePartRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateMotorcyclePartUsecase = new UpdateMotorcyclePartsUsecase(
      this.motorcyclePartRepository,
      this.motorcycleRepository,
      this.partRepository
    );
    const result = await updateMotorcyclePartUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      MotorcyclePartNotFoundError: () => context.json({ message: "Motorcycle part not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "MotorcyclePart ID is required" }, 400);
    }

    const deleteMotorcyclePartUsecase = new DeleteMotorcyclePartUsecase(
      this.motorcyclePartRepository
    );
    const result = await deleteMotorcyclePartUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      MotorcyclePartNotFoundError: () => context.json({ message: "Motorcycle part not found" }, 404),
    });
  }
}
