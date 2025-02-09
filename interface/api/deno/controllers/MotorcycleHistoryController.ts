import type { MotorcycleHistoryRepository } from "../../../../application/repositories/MotorcycleHistoryRepository.ts";
import { exhaustive } from "npm:exhaustive";
import { addMotorcycleHistoryRequestSchema, updateMotorcycleHistoryRequestSchema } from "../schemas/motorcycleHistoryRequestSchema.ts";
import { MotorcycleHistoryEntity } from "../../../../domain/entities/MotorcycleHistoryEntity.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { ListMotorcyclesHistoriesUsecase } from "../../../../application/usecases/motorcycleHistory/ListMotorcyclesHistoriesUsecase.ts";
import { AddMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/AddMotorcycleHistoryUsecase.ts";
import { GetMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/GetMotorcycleHistoryUsecase.ts";
import { UpdateMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/UpdateMotorcycleHistoryUsecase.ts";
import { DeleteMotorcycleHistoryUsecase } from "../../../../application/usecases/motorcycleHistory/DeleteMotorcycleHistoryUsecase.ts";

export class MotorcycleHistoryController implements EntityControllerInterface {
  public constructor(
    private readonly motorcycleHistoryRepository: MotorcycleHistoryRepository,
    private readonly listMotorcyclesHistoriesUsecase: ListMotorcyclesHistoriesUsecase,
    private readonly getMotorcycleHistoryUsecase: GetMotorcycleHistoryUsecase,
  ) {}

  public async getAll(): Promise<Response> {
    const result = await this.listMotorcyclesHistoriesUsecase.execute();

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
      return new Response("MotorcycleHistory ID is required", { status: 400 });
    }

    const result = await this.getMotorcycleHistoryUsecase.execute(id);

    if (result instanceof MotorcycleHistoryEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive({
      MotorcycleHistoryNotFoundError: () => new Response("MotorcycleHistoryNotFoundError", { status: 404 }),
    });
  }

  public async create(request: Request): Promise<Response> {
    const addMotorcycleHistoryUsecase = new AddMotorcycleHistoryUsecase(this.motorcycleHistoryRepository);
    const body = await request.json();
    const validation = addMotorcycleHistoryRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const result = await addMotorcycleHistoryUsecase.execute(validation.data);

    if (result instanceof MotorcycleHistoryEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      InvalidDateError: () => new Response("InvalidDateError", { status: 400 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const motorcycleHistoryId = url.searchParams.get("id");

    if (!motorcycleHistoryId) {
      return new Response("MotorcycleHistory ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateMotorcycleHistoryRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateMotorcycleHistoryUsecase = new UpdateMotorcycleHistoryUsecase(this.motorcycleHistoryRepository)
    const result = await updateMotorcycleHistoryUsecase.execute(motorcycleHistoryId, validation.data);

    if (result instanceof MotorcycleHistoryEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      MotorcycleHistoryNotFoundError: () => new Response("MotorcycleHistoryNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("MotorcycleHistory ID is required", { status: 400 });
    }

    const deleteMotorcycleHistoryUsecase = new DeleteMotorcycleHistoryUsecase(
      this.motorcycleHistoryRepository,
    );

    const result = await deleteMotorcycleHistoryUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, { status: 204 });
    }

    return exhaustive(result.name, {
      MotorcycleHistoryNotFoundError: () => new Response("MotorcycleHistoryNotFoundError", { status: 404 }),
    });
  }
}
