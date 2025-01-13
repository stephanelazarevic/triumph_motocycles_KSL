import type { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { ListPartsUsecase } from "../../../../application/usecases/ListPartsUsecase.ts";
import { CreatePartUsecase } from "../../../../application/usecases/CreatePartUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createPartRequestSchema } from "../schemas/createPartRequestSchema.ts";

export class PartController {
  public constructor(private readonly partRepository: PartRepository) {}

  /**
   * List all parts
   */
  public async listParts(_: Request): Promise<Response> {
    const listPartsUsecase = new ListPartsUsecase(this.partRepository);
    const parts = await listPartsUsecase.execute();

    return new Response(JSON.stringify(parts), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Create a new part
   */
  public async createPart(request: Request): Promise<Response> {
    const createPartUsecase = new CreatePartUsecase(this.partRepository);
    const body = await request.json();
    const validation = createPartRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { commandIdentifier, reference, type, price, stockQuantity } = validation.data;
    const error = await createPartUsecase.execute(commandIdentifier, reference, type, price, stockQuantity);

    if (!error) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(error.name, {
      CommandIdentifierInvalidError: () => new Response("CommandIdentifierInvalidError", { status: 400 }),
      ReferenceTooShortError: () => new Response("ReferenceTooShortError", { status: 400 }),
      TypeInvalidError: () => new Response("TypeInvalidError", { status: 400 }),
      PriceNegativeError: () => new Response("PriceNegativeError", { status: 400 }),
      StockQuantityNegativeError: () => new Response("StockQuantityNegativeError", { status: 400 }),
    });
  }
}
