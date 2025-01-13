import type { MotoRepository } from "../../../../application/repositories/MotoRepository.ts";
import { CreateMotoUsecase } from "../../../../application/usecases/CreateMotoUsecase.ts";
import { ListMotosUsecase } from "../../../../application/usecases/ListMotosUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createMotoRequestSchema } from "../schemas/createMotoRequestSchema.ts";

export class MotoController {
  public constructor(private readonly motoRepository: MotoRepository) {}

  public async listMotos(): Promise<Response> {
    const listMotosUsecase = new ListMotosUsecase(this.motoRepository);
    const motos = await listMotosUsecase.execute();

    return new Response(JSON.stringify(motos), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async createMoto(request: Request): Promise<Response> {
    const createMotoUsecase = new CreateMotoUsecase(this.motoRepository);
    const body = await request.json();
    
    const validation = createMotoRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { model, registrationNumber, status, partId } = validation.data;

    const error = await createMotoUsecase.execute(model, registrationNumber, status, partId);

    if (!error) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(error.name, {
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 400 }),
    });
  }
}
