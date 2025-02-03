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

export class MotorcycleController implements EntityControllerInterface {
  public constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  public async getAll(): Promise<Response> {
    const listMotorcyclesUsecase = new ListMotorcyclesUsecase(
      this.motorcycleRepository,
    );

    const result = await listMotorcyclesUsecase.execute();

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
      return new Response("Motorcycle ID is required", { status: 400 });
    }

    const getMotorcycleUsecase = new GetMotorcycleUsecase(this.motorcycleRepository);

    const result = await getMotorcycleUsecase.execute(id);

    if (result instanceof MotorcycleEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }

  public async create(request: Request): Promise<Response> {
    const addMotorcycleUsecase = new AddMotorcycleUsecase(this.motorcycleRepository);
    const body = await request.json();
    const validation = addMotorcycleRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const result = await addMotorcycleUsecase.execute(validation.data);

    if (result instanceof MotorcycleEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      BrandLengthTooShortError: () => new Response("BrandLengthTooShortError", { status: 400 }),
      ModelLengthTooShortError: () => new Response("ModelLengthTooShortError", { status: 400 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const motorcycleId = url.searchParams.get("id");

    if (!motorcycleId) {
      return new Response("Motorcycle ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateMotorcycleRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateMotorcycleUsecase = new UpdateMotorcycleUsecase(this.motorcycleRepository)
    const result = await updateMotorcycleUsecase.execute(motorcycleId, validation.data);

    if (result instanceof MotorcycleEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Motorcycle ID is required", { status: 400 });
    }

    const deleteMotorcycleUsecase = new DeleteMotorcycleUsecase(
      this.motorcycleRepository,
    );

    const result = await deleteMotorcycleUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, { status: 204 });
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }
}
