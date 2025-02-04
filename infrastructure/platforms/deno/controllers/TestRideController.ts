import type { TestRideRepository } from "../../../../application/repositories/TestRideRepository.ts";
import type { ClientRepository } from "../../../../application/repositories/ClientRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddTestRideUsecase } from "../../../../application/usecases/testRide/AddTestRideUsecase.ts";
import { GetTestRideUsecase } from "../../../../application/usecases/testRide/GetTestRideUsecase.ts";
import { ListTestRidesUsecase } from "../../../../application/usecases/testRide/ListTestRidesUsecase.ts";
import { UpdateTestRideUsecase } from "../../../../application/usecases/testRide/UpdateTestRideUsecase.ts";
import { DeleteTestRideUsecase } from "../../../../application/usecases/testRide/DeleteTestRideUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { addTestRideRequestSchema, updateTestRideRequestSchema } from "../schemas/testRideRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { TestRideEntity } from "../../../../domain/entities/TestRideEntity.ts";

export class TestRideController implements EntityControllerInterface{
  public constructor(
    private readonly testRideRepository: TestRideRepository,
    private readonly clientRepository: ClientRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listTestRidesUsecase = new ListTestRidesUsecase(
      this.testRideRepository,
    );

    const result = await listTestRidesUsecase.execute();

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
      return new Response("TestRide ID is required", { status: 400 });
    }

    const getTestRideUsecase = new GetTestRideUsecase(this.testRideRepository);

    const result = await getTestRideUsecase.execute(id);

    if (result instanceof TestRideEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      TestRideNotFoundError: () => new Response("TestRideNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const addTestRideUsecase = new AddTestRideUsecase(
      this.testRideRepository,
      this.clientRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = addTestRideRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addTestRideUsecase.execute(validation.data);

    if (result instanceof TestRideEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      InvalidDateError: () => new Response("InvalidDateError", { status: 400 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
      ClientNotFoundError: () => new Response("ClientNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const testRideId = url.searchParams.get("id");

    if (!testRideId) {
      return new Response("TestRide ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateTestRideRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateTestRideUsecase = new UpdateTestRideUsecase(this.testRideRepository, this.clientRepository, this.motorcycleRepository);
    const result = await updateTestRideUsecase.execute(testRideId, validation.data);

    if (result instanceof TestRideEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      TestRideNotFoundError: () => new Response("TestRideNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("TestRide ID is required", { status: 400 });
    }

    const deleteTestRideUsecase = new DeleteTestRideUsecase(
      this.testRideRepository,
    );

    const result = await deleteTestRideUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      TestRideNotFoundError: () => new Response("TestRideNotFoundError", { status: 404 }),
    });
  }
}
