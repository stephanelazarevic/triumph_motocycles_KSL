import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { exhaustive } from "npm:exhaustive";
import { addMotorcycleRequestSchema, updateMotorcycleRequestSchema } from "../schemas/motorcycleRequestSchema.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { ListMotorcyclesUsecase } from "../../../../application/usecases/motorcycle/ListMotorcyclesUsecase.ts";
import { AddMotorcycleUsecase } from "../../../../application/usecases/motorcycle/AddMotorcycleUsecase.ts";
import { GetMotorcycleUsecase } from "../../../../application/usecases/motorcycle/GetMotorcycleUsecase.ts";
import { UpdateMotorcycleUsecase } from "../../../../application/usecases/motorcycle/UpdateMotorcycleUsecase.ts";
import { DeleteMotorcycleUsecase } from "../../../../application/usecases/motorcycle/DeleteMotorcycleUsecase.ts";
import { AddMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/AddMotorcycleHistoryUsecase.ts";
import { MotorcycleHistoryRepository } from "../../../../application/repositories/MotorcycleHistoryRepository.ts";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";

export class MotorcycleController implements EntityControllerInterface {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly motorcycleHistoryRepository: MotorcycleHistoryRepository,
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listMotorcyclesUsecase = new ListMotorcyclesUsecase(
      this.motorcycleRepository,
    );

    const result = await listMotorcyclesUsecase.execute();

    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "Malformed ID is required" }, 400);
    }

    const getMotorcycleUsecase = new GetMotorcycleUsecase(this.motorcycleRepository);

    const result = await getMotorcycleUsecase.execute(id);

    if (result instanceof MotorcycleEntity) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404)
    });
  }

  public async create(context: Context): Promise<Response> {
    const addMotorcycleHistoryUsecase = new AddMotorcycleHistoryUsecase(this.motorcycleHistoryRepository),
    const addMotorcycleUsecase = new AddMotorcycleUsecase(this.motorcycleRepository, addMotorcycleHistoryUsecase);

    const body = await context.req.json();
    const validation = addMotorcycleRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const result = await addMotorcycleUsecase.execute(validation.data);

    if (result instanceof MotorcycleEntity) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive(result.name, {
      BrandLengthTooShortError: () => new Response("BrandLengthTooShortError", { status: 400 }),
      ModelLengthTooShortError: () => new Response("ModelLengthTooShortError", { status: 400 }),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "Malformed ID is required" }, 400);
    }

    const body = context.req.json();
    const validation = updateMotorcycleRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addMotorcycleHistoryUsecase = new AddMotorcycleHistoryUsecase(this.motorcycleHistoryRepository);
    const updateMotorcycleUsecase = new UpdateMotorcycleUsecase(
      this.motorcycleRepository,
      this.motorcycleHistoryRepository,
      addMotorcycleHistoryUsecase
    );

    const result = await updateMotorcycleUsecase.execute(id, validation.data);

    if (result instanceof MotorcycleEntity) {
      return context.json(JSON.stringify(result), 201);

    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404)
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param('id');

    if (!id) {
      return context.json({ message: "Malformed ID is required" }, 400);
    }

    const deleteMotorcycleUsecase = new DeleteMotorcycleUsecase(
      this.motorcycleRepository,
    );

    const result = await deleteMotorcycleUsecase.execute(id);

    if (result === undefined) {
      return context.json(null, 204);
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404)
    });
  }
}
