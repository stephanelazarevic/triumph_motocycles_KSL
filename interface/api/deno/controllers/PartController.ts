import type { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import type { DealerRepository } from "../../../../application/repositories/DealerRepository.ts";
import { AddPartUsecase } from "../../../../application/usecases/part/AddPartUsecase.ts";
import { GetPartUsecase } from "../../../../application/usecases/part/GetPartUsecase.ts";
import { ListPartsUsecase } from "../../../../application/usecases/part/ListPartsUsecase.ts";
import { UpdatePartUsecase } from "../../../../application/usecases/part/UpdatePartUsecase.ts";
import { DeletePartUsecase } from "../../../../application/usecases/part/DeletePartUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { addPartRequestSchema, updatePartRequestSchema } from "../schemas/partRequestSchema.ts";
import { PartEntity } from "../../../../domain/entities/PartEntity.ts";
import { OrderRepository } from "../../../../application/repositories/OrderRepository.ts";

export class PartController implements EntityControllerInterface {
  public constructor(
    private readonly partRepository: PartRepository,
    private readonly dealerRepository: DealerRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listPartsUsecase = new ListPartsUsecase(
      this.partRepository,
    );

    const result = await listPartsUsecase.execute();

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
      return new Response("Part ID is required", { status: 400 });
    }

    const getPartUsecase = new GetPartUsecase(
      this.partRepository,
    );

    const result = await getPartUsecase.execute(id);

    if (result instanceof PartEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const addPartUsecase = new AddPartUsecase(
      this.partRepository,
      this.dealerRepository,
      this.orderRepository,
    );

    const body = await request.json();

    const validation = addPartRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addPartUsecase.execute(validation.data);

    if (result instanceof PartEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      DealerNotFoundError: () => new Response("DealerNotFoundError", { status: 404 }),
      OrderNotFoundError: () => new Response("OrderNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const partId = url.searchParams.get("id");

    if (!partId) {
      return new Response("Part ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updatePartRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updatePartUsecase = new UpdatePartUsecase(this.partRepository, this.dealerRepository, this.orderRepository);
    const result = await updatePartUsecase.execute(partId, validation.data);

    if (result instanceof PartEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Part ID is required", { status: 400 });
    }

    const deletePartUsecase = new DeletePartUsecase(
      this.partRepository,
    );

    const result = await deletePartUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 404 }),
    });
  }
}
