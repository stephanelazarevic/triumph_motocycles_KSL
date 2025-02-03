import type { IncidentRepository } from "../../../../application/repositories/IncidentRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddIncidentUsecase } from "../../../../application/usecases/incident/AddIncidentUsecase.ts";
import { GetIncidentUsecase } from "../../../../application/usecases/incident/GetIncidentUsecase.ts";
import { ListIncidentsUsecase } from "../../../../application/usecases/incident/ListIncidentsUsecase.ts";
import { UpdateIncidentUsecase } from "../../../../application/usecases/incident/UpdateIncidentUsecase.ts";
import { DeleteIncidentUsecase } from "../../../../application/usecases/incident/DeleteIncidentUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { addIncidentRequestSchema, updateIncidentRequestSchema } from "../schemas/incidentRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { IncidentEntity } from "../../../../domain/entities/IncidentEntity.ts";

export class IncidentController implements EntityControllerInterface{
  public constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listIncidentsUsecase = new ListIncidentsUsecase(
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

    const getIncidentUsecase = new GetIncidentUsecase(this.incidentRepository);

    const result = await getIncidentUsecase.execute(id);

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
    const addIncidentUsecase = new AddIncidentUsecase(
      this.incidentRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = addIncidentRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addIncidentUsecase.execute(validation.data);

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
    const url = new URL(request.url);
    const incidentId = url.searchParams.get("id");

    if (!incidentId) {
      return new Response("Incident ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateIncidentRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateIncidentUsecase = new UpdateIncidentUsecase(this.incidentRepository, this.motorcycleRepository);
    const result = await updateIncidentUsecase.execute(incidentId, validation.data);

    if (result instanceof IncidentEntity) {
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
