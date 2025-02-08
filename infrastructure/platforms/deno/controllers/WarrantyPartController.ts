import type { WarrantyPartRepository } from "../../../../application/repositories/WarrantyPartRepository.ts";
import type { WarrantyRepository } from "../../../../application/repositories/WarrantyRepository.ts";
import type { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { AddWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/AddWarrantyPartUsecase.ts";
import { GetWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/GetWarrantyPartUsecase.ts";
import { ListWarrantyPartsUsecase } from "../../../../application/usecases/warrantyPart/ListWarrantyPartsUsecase.ts";
import { UpdateWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/UpdateWarrantyPartUsecase.ts";
import { DeleteWarrantyPartUsecase } from "../../../../application/usecases/warrantyPart/DeleteWarrantyPartUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { WarrantyPartEntity } from "../../../../domain/entities/WarrantyPartEntity.ts";
import { addWarrantyPartRequestSchema, updateWarrantyPartRequestSchema } from "../schemas/warrantyPartRequestSchema.ts";

export class WarrantyPartController implements EntityControllerInterface {
  public constructor(
    private readonly warrantyPartRepository: WarrantyPartRepository,
    private readonly warrantyRepository: WarrantyRepository,
    private readonly partRepository: PartRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listWarrantyPartsUsecase = new ListWarrantyPartsUsecase(
      this.warrantyPartRepository,
    );

    const result = await listWarrantyPartsUsecase.execute();

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
      return new Response("WarrantyPart ID is required", { status: 400 });
    }

    const getWarrantyPartUsecase = new GetWarrantyPartUsecase(
      this.warrantyPartRepository,
    );

    const result = await getWarrantyPartUsecase.execute(id);

    if (result instanceof WarrantyPartEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      WarrantyPartNotFoundError: () => new Response("WarrantyPartNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const addWarrantyPartUsecase = new AddWarrantyPartUsecase(
      this.warrantyPartRepository,
      this.warrantyRepository,
      this.partRepository,
    );

    const body = await request.json();

    const validation = addWarrantyPartRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addWarrantyPartUsecase.execute(validation.data);

    if (result instanceof WarrantyPartEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      WarrantyNotFoundError: () => new Response("WarrantyNotFoundError", { status: 404 }),
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const warrantyPartId = url.searchParams.get("id");

    if (!warrantyPartId) {
      return new Response("WarrantyPart ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateWarrantyPartRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateWarrantyPartUsecase = new UpdateWarrantyPartUsecase(this.warrantyPartRepository, this.warrantyRepository, this.partRepository);
    const result = await updateWarrantyPartUsecase.execute(warrantyPartId, validation.data);

    if (result instanceof WarrantyPartEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      WarrantyPartNotFoundError: () => new Response("WarrantyPartNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("WarrantyPart ID is required", { status: 400 });
    }

    const deleteWarrantyPartUsecase = new DeleteWarrantyPartUsecase(
      this.warrantyPartRepository,
    );

    const result = await deleteWarrantyPartUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      WarrantyPartNotFoundError: () => new Response("WarrantyPartNotFoundError", { status: 404 }),
    });
  }
}
