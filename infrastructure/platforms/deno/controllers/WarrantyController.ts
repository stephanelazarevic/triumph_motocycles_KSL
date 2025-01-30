import type { WarrantyRepository } from "../../../../application/repositories/WarrantyRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateWarrantyUsecase } from "../../../../application/usecases/warranty/CreateWarrantyUsecase.ts";
import { FindWarrantyUsecase } from "../../../../application/usecases/warranty/FindWarrantyUsecase.ts";
import { FindAllWarrantiesUsecase } from "../../../../application/usecases/warranty/FindAllWarrantiesUsecase.ts";
import { UpdateWarrantyUsecase } from "../../../../application/usecases/warranty/UpdateWarrantyUsecase.ts";
import { DeleteWarrantyUsecase } from "../../../../application/usecases/warranty/DeleteWarrantyUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { createWarrantyRequestSchema } from "../schemas/createWarrantyRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { WarrantyEntity } from "../../../../domain/entities/WarrantyEntity.ts";

export class WarrantyController implements EntityControllerInterface {
  public constructor(
    private readonly warrantyRepository: WarrantyRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listWarrantiesUsecase = new FindAllWarrantiesUsecase(
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

    const findWarrantyUsecase = new FindWarrantyUsecase(
      this.warrantyRepository,
    );

    const result = await findWarrantyUsecase.execute(id);

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
    const createWarrantyUsecase = new CreateWarrantyUsecase(
      this.warrantyRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = createWarrantyRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { startDate, endDate, warrantyType, motorcycleId, terms } = validation.data;

    const result = await createWarrantyUsecase.execute(startDate, endDate, warrantyType, motorcycleId, terms);

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
    const updateWarrantyUsecase = new UpdateWarrantyUsecase(
      this.warrantyRepository,
    );

    const body = await request.json();

    // @TODO: use update request schema
    const validation = createWarrantyRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    // @TODO: validation.data doesn't match execute expected input
    const result = await updateWarrantyUsecase.execute(validation.data);

    if (result === undefined) {
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
