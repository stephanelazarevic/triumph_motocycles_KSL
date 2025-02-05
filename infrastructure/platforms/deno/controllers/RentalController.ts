import type { RentalRepository } from "../../../../application/repositories/RentalRepository.ts";
import { ClientRepository } from "../../../../application/repositories/ClientRepository.ts";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddRentalUsecase } from "../../../../application/usecases/rental/AddRentalUsecase.ts";
import { GetRentalUsecase } from "../../../../application/usecases/rental/GetRentalUsecase.ts";
import { ListRentalsUsecase } from "../../../../application/usecases/rental/ListRentalsUsecase.ts";
import { UpdateRentalUsecase } from "../../../../application/usecases/rental/UpdateRentalUsecase.ts";
import { DeleteRentalUsecase } from "../../../../application/usecases/rental/DeleteRentalUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { addRentalRequestSchema, updateRentalRequestSchema } from "../schemas/rentalRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { NotificationEntity } from "../../../../domain/entities/NotificationEntity.ts";
import { RentalEntity } from "../../../../domain/entities/RentalEntity.ts";

export class RentalController implements EntityControllerInterface{
  public constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly clientRepository: ClientRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async getAll(): Promise<Response> {
    const listRentalsUsecase = new ListRentalsUsecase(this.rentalRepository);

    const result = await listRentalsUsecase.execute();

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
      return new Response("Rental ID is required", { status: 400 });
    }

    const getRentalUsecase = new GetRentalUsecase(this.rentalRepository);

    const result = await getRentalUsecase.execute(id);

    if (result instanceof NotificationEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive({
      RentalNotFoundError: () =>
        new Response("RentalNotFoundError", { status: 404 }),
    });
  }

  public async create(request: Request): Promise<Response> {
    const addRentalUsecase = new AddRentalUsecase(
      this.rentalRepository,
      this.clientRepository,
      this.motorcycleRepository
    );

    const body = await request.json();

    const validation = addRentalRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addRentalUsecase.execute(validation.data);

    if (result instanceof RentalEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      ClientNotFoundError: () => new Response("ClientNotFoundError", { status: 404 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
      InvalidDateError: () => new Response("InvalidDateError", { status: 400 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const rentalId = url.searchParams.get("id");

    if (!rentalId) {
      return new Response("Rental ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateRentalRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const updateRentalUsecase = new UpdateRentalUsecase(this.rentalRepository, this.clientRepository, this.motorcycleRepository);
    const result = await updateRentalUsecase.execute(rentalId, validation.data);

    if (result instanceof RentalEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      RentalNotFoundError: () =>
        new Response("RentalNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Rental ID is required", { status: 400 });
    }

    const deleteRentalUsecase = new DeleteRentalUsecase(
      this.rentalRepository
    );

    const result = await deleteRentalUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, { status: 204 });
    }

    return exhaustive(result.name, {
      RentalNotFoundError: () =>
        new Response("RentalNotFoundError", { status: 404 }),
    });
  }
}
