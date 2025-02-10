import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { RentalRepository } from "../../../../application/repositories/RentalRepository.ts";
import { ClientRepository } from "../../../../application/repositories/ClientRepository.ts";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddRentalUsecase } from "../../../../application/usecases/rental/AddRentalUsecase.ts";
import { GetRentalUsecase } from "../../../../application/usecases/rental/GetRentalUsecase.ts";
import { ListRentalsUsecase } from "../../../../application/usecases/rental/ListRentalsUsecase.ts";
import { UpdateRentalUsecase } from "../../../../application/usecases/rental/UpdateRentalUsecase.ts";
import { DeleteRentalUsecase } from "../../../../application/usecases/rental/DeleteRentalUsecase.ts";
import { addRentalRequestSchema, updateRentalRequestSchema } from "../schemas/rentalRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class RentalController implements EntityControllerInterface{
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly clientRepository: ClientRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listRentalsUsecase = new ListRentalsUsecase(this.rentalRepository);
    const result = await listRentalsUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Rental ID is required" }, 400);
    }

    const getRentalUsecase = new GetRentalUsecase(this.rentalRepository);
    const result = await getRentalUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      RentalNotFoundError: () => context.json({ message: "Rental not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addRentalRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addRentalUsecase = new AddRentalUsecase(
      this.rentalRepository,
      this.clientRepository,
      this.motorcycleRepository
    );
    const result = await addRentalUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      ClientNotFoundError: () => context.json({ message: "Client not found" }, 404),
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404),
      InvalidDateError: () => context.json({ message: "Invalid date" }, 400),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Rental ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateRentalRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateRentalUsecase = new UpdateRentalUsecase(
      this.rentalRepository,
      this.clientRepository,
      this.motorcycleRepository
    );
    const result = await updateRentalUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      RentalNotFoundError: () => context.json({ message: "Rental not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Rental ID is required" }, 400);
    }

    const deleteRentalUsecase = new DeleteRentalUsecase(this.rentalRepository);
    const result = await deleteRentalUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      RentalNotFoundError: () => context.json({ message: "Rental not found" }, 404),
    });
  }
}
