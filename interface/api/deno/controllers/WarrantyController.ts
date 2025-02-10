import type { WarrantyRepository } from "../../../../application/repositories/WarrantyRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddWarrantyUsecase } from "../../../../application/usecases/warranty/AddWarrantyUsecase.ts";
import { GetWarrantyUsecase } from "../../../../application/usecases/warranty/GetWarrantyUsecase.ts";
import { ListWarrantiesUsecase } from "../../../../application/usecases/warranty/ListWarrantiesUsecase.ts";
import { UpdateWarrantyUsecase } from "../../../../application/usecases/warranty/UpdateWarrantyUsecase.ts";
import { DeleteWarrantyUsecase } from "../../../../application/usecases/warranty/DeleteWarrantyUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { WarrantyEntity } from "../../../../domain/entities/WarrantyEntity.ts";
import { addWarrantyRequestSchema, updateWarrantyRequestSchema } from "../schemas/warrantyRequestSchema.ts";

export class WarrantyController implements EntityControllerInterface {
  public constructor(
    private readonly warrantyRepository: WarrantyRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listWarrantiesUsecase = new ListWarrantiesUsecase(
      this.warrantyRepository,
    );

    const result = await listWarrantiesUsecase.execute();

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
      return new Response("Warranty ID is required", { status: 400 });
    }

    const getWarrantyUsecase = new GetWarrantyUsecase(
      this.warrantyRepository,
    );

    const result = await getWarrantyUsecase.execute(id);

    if (result instanceof WarrantyEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      WarrantyNotFoundError: () => new Response("WarrantyNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const addWarrantyUsecase = new AddWarrantyUsecase(
      this.warrantyRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = addWarrantyRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addWarrantyUsecase.execute(validation.data);

    if (result instanceof WarrantyEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      InvalidDateError: () => new Response("InvalidDateError", { status: 400 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const warrantyId = url.searchParams.get("id");

    if (!warrantyId) {
      return new Response("Warranty ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateWarrantyRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateWarrantyUsecase = new UpdateWarrantyUsecase(this.warrantyRepository, this.motorcycleRepository);
    const result = await updateWarrantyUsecase.execute(warrantyId, validation.data);

    if (result instanceof WarrantyEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      WarrantyNotFoundError: () => new Response("WarrantyNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Warranty ID is required", { status: 400 });
    }

    const deleteWarrantyUsecase = new DeleteWarrantyUsecase(
      this.warrantyRepository,
    );

    const result = await deleteWarrantyUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      WarrantyNotFoundError: () => new Response("WarrantyNotFoundError", { status: 404 }),
    });
  }
}
