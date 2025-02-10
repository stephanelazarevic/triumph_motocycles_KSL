import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { DealerRepository } from "../../../../application/repositories/DealerRepository.ts";
import { OrderRepository } from "../../../../application/repositories/OrderRepository.ts";
import { AddPartUsecase } from "../../../../application/usecases/part/AddPartUsecase.ts";
import { GetPartUsecase } from "../../../../application/usecases/part/GetPartUsecase.ts";
import { ListPartsUsecase } from "../../../../application/usecases/part/ListPartsUsecase.ts";
import { UpdatePartUsecase } from "../../../../application/usecases/part/UpdatePartUsecase.ts";
import { DeletePartUsecase } from "../../../../application/usecases/part/DeletePartUsecase.ts";
import { addPartRequestSchema, updatePartRequestSchema } from "../schemas/partRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class PartController implements EntityControllerInterface{
  constructor(
    private readonly partRepository: PartRepository,
    private readonly dealerRepository: DealerRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listPartsUsecase = new ListPartsUsecase(this.partRepository);
    const result = await listPartsUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Part ID is required" }, 400);
    }

    const getPartUsecase = new GetPartUsecase(this.partRepository);
    const result = await getPartUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive("PartNotFoundError", {
      PartNotFoundError: () => context.json({ message: "Part not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addPartRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addPartUsecase = new AddPartUsecase(
      this.partRepository,
      this.dealerRepository,
      this.orderRepository
    );
    const result = await addPartUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive("DealerNotFoundError", {
      DealerNotFoundError: () => context.json({ message: "Dealer not found" }, 404),
      OrderNotFoundError: () => context.json({ message: "Order not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Part ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updatePartRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updatePartUsecase = new UpdatePartUsecase(
      this.partRepository,
      this.dealerRepository,
      this.orderRepository
    );
    const result = await updatePartUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive("PartNotFoundError", {
      PartNotFoundError: () => context.json({ message: "Part not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Part ID is required" }, 400);
    }

    const deletePartUsecase = new DeletePartUsecase(this.partRepository);
    const result = await deletePartUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive("PartNotFoundError", {
      PartNotFoundError: () => context.json({ message: "Part not found" }, 404),
    });
  }
}
