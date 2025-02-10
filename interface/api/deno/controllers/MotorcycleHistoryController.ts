import type { MotorcycleHistoryRepository } from "../../../../application/repositories/MotorcycleHistoryRepository.ts";
import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { addMotorcycleHistoryRequestSchema, updateMotorcycleHistoryRequestSchema } from "../schemas/motorcycleHistoryRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { ListMotorcyclesHistoriesUsecase } from "../../../../application/usecases/motorcycleHistory/ListMotorcyclesHistoriesUsecase.ts";
import { AddMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/AddMotorcycleHistoryUsecase.ts";
import { GetMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/GetMotorcycleHistoryUsecase.ts";
import { UpdateMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/UpdateMotorcycleHistoryUsecase.ts";
import { DeleteMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/DeleteMotorcycleHistoryUsecase.ts";
import { MotorcycleHistoryService } from "../../../../application/services/MotorcycleHistoryService.ts";
import { MotorcycleHistoryNotFoundError } from "../../../../domain/errors/MotorcycleHistoryNotFoundError.ts";

export class MotorcycleHistoryController implements EntityControllerInterface {
  public constructor(
    private readonly motorcycleHistoryRepository: MotorcycleHistoryRepository,
    private readonly motorcycleHistoryService: MotorcycleHistoryService
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listMotorcyclesHistoriesUsecase = new ListMotorcyclesHistoriesUsecase(
      this.motorcycleHistoryRepository,
      this.motorcycleHistoryService
    );
    const result = await listMotorcyclesHistoriesUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "MotorcycleHistory ID is required" }, 400);
    }

    const getMotorcycleHistoryUsecase = new GetMotorcycleHistoryUsecase(
      this.motorcycleHistoryRepository,
      this.motorcycleHistoryService
    );

    const result = await getMotorcycleHistoryUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      MotorcycleHistoryNotFoundError: () => context.json({ message: "Motorcycle history not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addMotorcycleHistoryRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addMotorcycleHistoryUsecase = new AddMotorcycleHistoryUsecase(
      this.motorcycleHistoryRepository
    );
    const result = await addMotorcycleHistoryUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      InvalidDateError: () => context.json({ message: "Invalid date" }, 400),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "MotorcycleHistory ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateMotorcycleHistoryRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateMotorcycleHistoryUsecase = new UpdateMotorcycleHistoryUsecase(
      this.motorcycleHistoryRepository
    );
    const result = await updateMotorcycleHistoryUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      MotorcycleHistoryNotFoundError: () => context.json({ message: "Motorcycle history not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "MotorcycleHistory ID is required" }, 400);
    }

    const deleteMotorcycleHistoryUsecase = new DeleteMotorcycleHistoryUsecase(
      this.motorcycleHistoryRepository
    );
    const result = await deleteMotorcycleHistoryUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      MotorcycleHistoryNotFoundError: () => context.json({ message: "Motorcycle history not found" }, 404),
    });
  }

  public async getByMotorcycleId(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Motorcycle ID is required" }, 400);
    }

    const result = await this.motorcycleHistoryRepository.findByMotorcycleId(id);
    return context.json(JSON.stringify(result), 200);
  }

  public async getLastByMotorcycleId(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Motorcycle ID is required" }, 400);
    }

    const result = await this.motorcycleHistoryRepository.findLastByMotorcycleId(id);

    if (result instanceof MotorcycleHistoryNotFoundError) {
      return context.json({ message: "Motorcycle history not found" }, 404);
    }

    return context.json(JSON.stringify(result), 200);
  }
}
