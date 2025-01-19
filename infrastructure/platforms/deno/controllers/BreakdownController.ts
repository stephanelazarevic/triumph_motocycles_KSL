import type { BreakdownRepository } from "../../../../application/repositories/BreakdownRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateBreakdownUsecase } from "../../../../application/usecases/breakdown/CreateBreakdownUsecase.ts";
import { FindBreakdownUsecase } from "../../../../application/usecases/breakdown/FindBreakdownUsecase.ts";
import { FindAllBreakdownsUsecase } from "../../../../application/usecases/breakdown/FindAllBreakdownsUsecase.ts";
import { UpdateBreakdownUsecase } from "../../../../application/usecases/breakdown/UpdateBreakdownUsecase.ts";
import { DeleteBreakdownUsecase } from "../../../../application/usecases/breakdown/DeleteBreakdownUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { createBreakdownRequestSchema } from "../schemas/createBreakdownRequestSchema.ts";
import { BreakdownNotFoundError } from "../../../../domain/errors/BreakdownNotFoundError.ts";

export class BreakdownController {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async getAllBreakdowns(): Promise<Response> {
    const listBreakdownsUsecase = new FindAllBreakdownsUsecase(
      this.breakdownRepository,
    );

    const result = await listBreakdownsUsecase.execute();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getBreakdownById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Breakdown ID is required", { status: 400 });
    }

    const findBreakdownUsecase = new FindBreakdownUsecase(
      this.breakdownRepository,
    );

    const result = await findBreakdownUsecase.execute(id);

    if (result instanceof BreakdownNotFoundError) {
      return new Response("BreakdownNotFoundError", { status: 404 });
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
      BreakdownNotFoundError: () => new Response("BreakdownNotFoundError", { status: 404 }),
    });

  }

  public async createBreakdown(request: Request): Promise<Response> {
    const createBreakdownUsecase = new CreateBreakdownUsecase(
      this.breakdownRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = createBreakdownRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { description, motorcycleId, type, reportDate, resolutionDate, status } = validation.data;

    const error = await createBreakdownUsecase.execute(description, motorcycleId, type, reportDate, resolutionDate, status);

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

  public async updateBreakdown(request: Request): Promise<Response> {
    const updateBreakdownUsecase = new UpdateBreakdownUsecase(
      this.breakdownRepository,
    );

    const body = await request.json();

    const validation = createBreakdownRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await updateBreakdownUsecase.execute(validation.data);

    if (result === undefined) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      BreakdownNotFoundError: () => new Response("BreakdownNotFoundError", { status: 404 }),
    });
  }

  public async deleteBreakdown(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Breakdown ID is required", { status: 400 });
    }

    const deleteBreakdownUsecase = new DeleteBreakdownUsecase(
      this.breakdownRepository,
    );

    const result = await deleteBreakdownUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      BreakdownNotFoundError: () => new Response("BreakdownNotFoundError", { status: 404 }),
    });
  }
}
