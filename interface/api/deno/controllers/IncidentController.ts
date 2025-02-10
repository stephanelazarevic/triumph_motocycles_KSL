import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { IncidentRepository } from "../../../../application/repositories/IncidentRepository.ts";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { AddIncidentUsecase } from "../../../../application/usecases/incident/AddIncidentUsecase.ts";
import { GetIncidentUsecase } from "../../../../application/usecases/incident/GetIncidentUsecase.ts";
import { ListIncidentsUsecase } from "../../../../application/usecases/incident/ListIncidentsUsecase.ts";
import { UpdateIncidentUsecase } from "../../../../application/usecases/incident/UpdateIncidentUsecase.ts";
import { DeleteIncidentUsecase } from "../../../../application/usecases/incident/DeleteIncidentUsecase.ts";
import { addIncidentRequestSchema, updateIncidentRequestSchema } from "../schemas/incidentRequestSchema.ts";
import { GetIncidentByMotorcycleIdAndPeriodUsecase } from "../../../../application/usecases/incident/GetIncidentByMotorcycleIdAndPeriodUsecase.ts";
import { MotorcycleHistoryNotFoundError } from "../../../../domain/errors/MotorcycleHistoryNotFoundError.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class IncidentController implements EntityControllerInterface{
  constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listIncidentsUsecase = new ListIncidentsUsecase(this.incidentRepository);
    const result = await listIncidentsUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Incident ID is required" }, 400);
    }

    const getIncidentUsecase = new GetIncidentUsecase(this.incidentRepository);
    const result = await getIncidentUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      IncidentNotFoundError: () => context.json({ message: "Incident not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addIncidentRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addIncidentUsecase = new AddIncidentUsecase(
      this.incidentRepository,
      this.motorcycleRepository
    );
    const result = await addIncidentUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      MotorcycleNotFoundError: () => context.json({ message: "Motorcycle not found" }, 404),
      InvalidDateError: () => context.json({ message: "Invalid date" }, 400),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Incident ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateIncidentRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateIncidentUsecase = new UpdateIncidentUsecase(
      this.incidentRepository,
      this.motorcycleRepository
    );
    const result = await updateIncidentUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      IncidentNotFoundError: () => context.json({ message: "Incident not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Incident ID is required" }, 400);
    }

    const deleteIncidentUsecase = new DeleteIncidentUsecase(this.incidentRepository);
    const result = await deleteIncidentUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      IncidentNotFoundError: () => context.json({ message: "Incident not found" }, 404),
    });
  }

  public async getIncidentByMotorcycleIdAndPeriod(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Motorcycle ID is required" }, 400);
    }
    const startDateParam = context.req.query("startDate");
    const endDateParam = context.req.query("endDate");
    
    if (!startDateParam || isNaN(Date.parse(startDateParam))) {
      return context.json({ message: "Valid startDate is required" }, 400);
    }
    
    const startDate = new Date(startDateParam);
    const endDate = endDateParam && !isNaN(Date.parse(endDateParam)) ? new Date(endDateParam) : null;
    
    const usecase = new GetIncidentByMotorcycleIdAndPeriodUsecase(this.incidentRepository);
    const result = await usecase.execute(id, startDate, endDate);
    
    if (result instanceof MotorcycleHistoryNotFoundError) {
      return context.json({ message: "Motorcycle history not found" }, 404);
    }
    return context.json(JSON.stringify(result), 200);
  }
}
