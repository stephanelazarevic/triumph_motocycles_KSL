import type { IncidentRepository } from "../../../../application/repositories/IncidentRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateIncidentUsecase } from "../../../../application/usecases/breakdown/CreateIncidentUsecase.ts";
import { FindIncidentUsecase } from "../../../../application/usecases/breakdown/FindIncidentUsecase.ts";
import { FindAllIncidentsUsecase } from "../../../../application/usecases/breakdown/FindAllIncidentsUsecase.ts";
import { UpdateIncidentUsecase } from "../../../../application/usecases/breakdown/UpdateIncidentUsecase.ts";
import { DeleteIncidentUsecase } from "../../../../application/usecases/breakdown/DeleteIncidentUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { createIncidentRequestSchema } from "../schemas/createIncidentRequestSchema.ts";
import { IncidentNotFoundError } from "../../../../domain/errors/IncidentNotFoundError.ts";

export class IncidentController {
  public constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAllIncidents(): Promise<Response> {
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

  public async getIncidentById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Incident ID is required", { status: 400 });
    }

    const findIncidentUsecase = new FindIncidentUsecase(
      this.incidentRepository,
    );

    const result = await findIncidentUsecase.execute(id);

    if (result instanceof IncidentNotFoundError) {
      return new Response("IncidentNotFoundError", { status: 404 });
    }

    if (typeof result === "object" && result !== null) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive({
      IncidentNotFoundError: () => new Response("IncidentNotFoundError", { status: 404 }),
    });

  }

  public async createIncident(request: Request): Promise<Response> {
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

    const error = await createIncidentUsecase.execute(description, motorcycleId, type, reportDate, resolutionDate, status);

    if (!error) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(error.name, {
      InvalidDateError: () => new Response("InvalidDateError", { status: 400 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 404 }),
    });
  }

  public async updateIncident(request: Request): Promise<Response> {
    const updateIncidentUsecase = new UpdateIncidentUsecase(
      this.incidentRepository,
    );

    const body = await request.json();

    const validation = createIncidentRequestSchema.safeParse(body);

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

  public async deleteIncident(request: Request): Promise<Response> {
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
