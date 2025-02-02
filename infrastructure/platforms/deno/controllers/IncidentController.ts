import type { IncidentRepository } from "../../../../application/repositories/IncidentRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateIncidentUsecase } from "../../../../application/usecases/incident/CreateIncidentUsecase.ts";
import { FindIncidentUsecase } from "../../../../application/usecases/incident/FindIncidentUsecase.ts";
import { FindAllIncidentsUsecase } from "../../../../application/usecases/incident/FindAllIncidentsUsecase.ts";
import { UpdateIncidentUsecase } from "../../../../application/usecases/incident/UpdateIncidentUsecase.ts";
import { DeleteIncidentUsecase } from "../../../../application/usecases/incident/DeleteIncidentUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { createIncidentRequestSchema, updateIncidentRequestSchema } from "../schemas/incidentRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { IncidentEntity } from "../../../../domain/entities/IncidentEntity.ts";

export class IncidentController implements EntityControllerInterface{
  public constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listIncidentsUsecase = new FindAllIncidentsUsecase(
      this.incidentRepository,
    );

    const result = await listIncidentsUsecase.execute();

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
      return new Response("Incident ID is required", { status: 400 });
    }

    const findIncidentUsecase = new FindIncidentUsecase(
      this.incidentRepository,
    );

    const result = await findIncidentUsecase.execute(id);

    if (result instanceof IncidentEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      IncidentNotFoundError: () => new Response("IncidentNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const createIncidentUsecase = new CreateIncidentUsecase(
      this.incidentRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = createIncidentRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { description, motorcycleId, type, reportDate, resolutionDate, status } = validation.data;

    const result = await createIncidentUsecase.execute(description, motorcycleId, type, reportDate, resolutionDate, status);

    if (result instanceof IncidentEntity) {
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
    const updateIncidentUsecase = new UpdateIncidentUsecase(
      this.incidentRepository,
    );

    const body = await request.json();

    const validation = updateIncidentRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await updateIncidentUsecase.execute(validation.data);

    if (result === undefined) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      IncidentNotFoundError: () => new Response("IncidentNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Incident ID is required", { status: 400 });
    }

    const deleteIncidentUsecase = new DeleteIncidentUsecase(
      this.incidentRepository,
    );

    const result = await deleteIncidentUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      IncidentNotFoundError: () => new Response("IncidentNotFoundError", { status: 404 }),
    });
  }
}
