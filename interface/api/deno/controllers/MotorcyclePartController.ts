import type { MotorcyclePartRepository } from "../../../../application/repositories/MotorcyclePartRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import type { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { exhaustive } from "npm:exhaustive";
import { addMotorcyclePartRequestSchema, updateMotorcyclePartRequestSchema } from "../schemas/motorcyclePartRequestSchema.ts";
import { MotorcyclePartEntity } from "../../../../domain/entities/MotorcyclePartEntity.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { ListMotorcyclePartsUsecase } from "../../../../application/usecases/motorcyclePart/ListMotorcyclePartsUsecase.ts";
import { AddMotorcyclePartUsecase } from "../../../../application/usecases/motorcyclePart/AddMotorcyclePartUsecase.ts";
import { GetMotorcyclePartUsecase } from "../../../../application/usecases/motorcyclePart/GetMotorcyclePartUsecase.ts";
import { UpdateMotorcyclePartsUsecase } from "../../../../application/usecases/motorcyclePart/UpdateMotorcyclePartsUsecase.ts";
import { DeleteMotorcyclePartUsecase } from "../../../../application/usecases/motorcyclePart/DeleteMotorcyclePartUsecase.ts";

export class MotorcyclePartController implements EntityControllerInterface {
  public constructor(
    private readonly motorcyclePartRepository: MotorcyclePartRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly partRepository: PartRepository,
) {}

  public async getAll(): Promise<Response> {
    const listMotorcyclePartsUsecase = new ListMotorcyclePartsUsecase(
      this.motorcyclePartRepository,
    );

    const result = await listMotorcyclePartsUsecase.execute();

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
      return new Response("MotorcyclePart ID is required", { status: 400 });
    }

    const getMotorcyclePartUsecase = new GetMotorcyclePartUsecase(this.motorcyclePartRepository);

    const result = await getMotorcyclePartUsecase.execute(id);

    if (result instanceof MotorcyclePartEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      MotorcyclePartNotFoundError: () => new Response("MotorcyclePartNotFoundError", { status: 404 }),
    });
  }

  public async create(request: Request): Promise<Response> {
    const addMotorcyclePartUsecase = new AddMotorcyclePartUsecase(
        this.motorcyclePartRepository,
        this.motorcycleRepository,
        this.partRepository,
    );
    const body = await request.json();
    const validation = addMotorcyclePartRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const result = await addMotorcyclePartUsecase.execute(validation.data);

    if (result instanceof MotorcyclePartEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const motorcyclePartId = url.searchParams.get("id");

    if (!motorcyclePartId) {
      return new Response("MotorcyclePart ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateMotorcyclePartRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateMotorcyclePartUsecase = new UpdateMotorcyclePartsUsecase(
        this.motorcyclePartRepository, 
        this.motorcycleRepository, 
        this.partRepository)

    const result = await updateMotorcyclePartUsecase.execute(motorcyclePartId, validation.data);

    if (result instanceof MotorcyclePartEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      MotorcyclePartNotFoundError: () => new Response("MotorcyclePartNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("MotorcyclePart ID is required", { status: 400 });
    }

    const deleteMotorcyclePartUsecase = new DeleteMotorcyclePartUsecase(
      this.motorcyclePartRepository,
    );

    const result = await deleteMotorcyclePartUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, { status: 204 });
    }

    return exhaustive(result.name, {
      MotorcyclePartNotFoundError: () => new Response("MotorcyclePartNotFoundError", { status: 404 }),
    });
  }
}
