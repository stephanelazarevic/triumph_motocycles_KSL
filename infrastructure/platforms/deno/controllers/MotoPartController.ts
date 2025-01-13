import type { MotoPartRepository } from "../../../../application/repositories/MotoPartRepository.ts";
import { CreateMotoPartUsecase } from "../../../../application/usecases/CreateMotoPartUsecase.ts";
import { ListMotoPartsUsecase } from "../../../../application/usecases/ListMotoPartsUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createMotoPartRequestSchema } from "../schemas/createMotoPartRequestSchema.ts";

export class MotoPartController {
  public constructor(
    private readonly motoPartRepository: MotoPartRepository,
  ) {}

  public async listMotoParts(): Promise<Response> {
    const listMotoPartsUsecase = new ListMotoPartsUsecase(this.motoPartRepository);
    const motoParts = await listMotoPartsUsecase.execute();

    return new Response(JSON.stringify(motoParts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async createMotoPart(request: Request): Promise<Response> {
    const createMotoPartUsecase = new CreateMotoPartUsecase(this.motoPartRepository);
    const body = await request.json();
    
    const validation = createMotoPartRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { clientId, dealerId, model, registrationNumber, status } = validation.data;

    const error = await createMotoPartUsecase.execute(clientId, dealerId, model, registrationNumber, status);

    if (!error) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(error.name, {
      ClientNotFoundError: () => new Response("ClientNotFoundError", { status: 400 }),
      DealerNotFoundError: () => new Response("DealerNotFoundError", { status: 400 }),
    });
  }
}
