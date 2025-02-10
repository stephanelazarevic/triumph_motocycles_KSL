import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { OrderRepository } from "../../../../application/repositories/OrderRepository.ts";
import { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { AddOrderUsecase } from "../../../../application/usecases/order/AddOrderUsecase.ts";
import { GetOrderUsecase } from "../../../../application/usecases/order/GetOrderUsecase.ts";
import { ListOrdersUsecase } from "../../../../application/usecases/order/ListOrdersUsecase.ts";
import { UpdateOrderUsecase } from "../../../../application/usecases/order/UpdateOrderUsecase.ts";
import { DeleteOrderUsecase } from "../../../../application/usecases/order/DeleteOrderUsecase.ts";
import { addOrderRequestSchema, updateOrderRequestSchema } from "../schemas/orderRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class OrderController implements EntityControllerInterface{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listOrdersUsecase = new ListOrdersUsecase(this.orderRepository);
    const result = await listOrdersUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Order ID is required" }, 400);
    }

    const getOrderUsecase = new GetOrderUsecase(this.orderRepository);
    const result = await getOrderUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      OrderNotFoundError: () => context.json({ message: "Order not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addOrderRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addOrderUsecase = new AddOrderUsecase(
      this.orderRepository,
      this.partRepository
    );
    const result = await addOrderUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      PartNotFoundError: () => context.json({ message: "Part not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Order ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateOrderRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateOrderUsecase = new UpdateOrderUsecase(this.orderRepository, this.partRepository);
    const result = await updateOrderUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      OrderNotFoundError: () => context.json({ message: "Order not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Order ID is required" }, 400);
    }

    const deleteOrderUsecase = new DeleteOrderUsecase(this.orderRepository);
    const result = await deleteOrderUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive({
      OrderNotFoundError: () => context.json({ message: "Order not found" }, 404),
    });
  }
}
