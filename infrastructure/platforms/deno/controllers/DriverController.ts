import type { DriverRepository } from "../../../../application/repositories/DriverRepository.ts";
import type { EnterpriseRepository } from "../../../../application/repositories/EnterpriseRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddDriverUsecase } from "../../../../application/usecases/driver/AddDriverUsecase.ts";
import { GetDriverUsecase } from "../../../../application/usecases/driver/GetDriverUsecase.ts";
import { ListDriversUsecase } from "../../../../application/usecases/driver/ListDriversUsecase.ts";
import { UpdateDriverUsecase } from "../../../../application/usecases/driver/UpdateDriverUsecase.ts";
import { DeleteDriverUsecase } from "../../../../application/usecases/driver/DeleteDriverUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { addDriverRequestSchema, updateDriverRequestSchema } from "../schemas/driverRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { DriverEntity } from "../../../../domain/entities/DriverEntity.ts";

export class DriverController implements EntityControllerInterface{
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listDriversUsecase = new ListDriversUsecase(
      this.driverRepository,
    );

    const result = await listDriversUsecase.execute();

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
      return new Response("Driver ID is required", { status: 400 });
    }

    const getDriverUsecase = new GetDriverUsecase(this.driverRepository);

    const result = await getDriverUsecase.execute(id);

    if (result instanceof DriverEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      DriverNotFoundError: () => new Response("DriverNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const addDriverUsecase = new AddDriverUsecase(
      this.driverRepository,
      this.enterpriseRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = addDriverRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addDriverUsecase.execute(validation.data);

    if (result instanceof DriverEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      EnterpriseNotFoundError: () => new Response("EnterpriseNotFoundError", { status: 404 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const driverId = url.searchParams.get("id");

    if (!driverId) {
      return new Response("Driver ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateDriverRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateDriverUsecase = new UpdateDriverUsecase(this.driverRepository, this.enterpriseRepository, this.motorcycleRepository);
    const result = await updateDriverUsecase.execute(driverId, validation.data);

    if (result instanceof DriverEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      DriverNotFoundError: () => new Response("DriverNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Driver ID is required", { status: 400 });
    }

    const deleteDriverUsecase = new DeleteDriverUsecase(
      this.driverRepository,
    );

    const result = await deleteDriverUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      DriverNotFoundError: () => new Response("DriverNotFoundError", { status: 404 }),
    });
  }
}
