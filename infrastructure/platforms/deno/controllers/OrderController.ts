import type { OrderRepository } from "../../../../application/repositories/OrderRepository.ts";
import type { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { AddOrderUsecase } from "../../../../application/usecases/order/AddOrderUsecase.ts";
import { GetOrderUsecase } from "../../../../application/usecases/order/GetOrderUsecase.ts";
import { ListOrdersUsecase } from "../../../../application/usecases/order/ListOrdersUsecase.ts";
import { UpdateOrderUsecase } from "../../../../application/usecases/order/UpdateOrderUsecase.ts";
import { DeleteOrderUsecase } from "../../../../application/usecases/order/DeleteOrderUsecase.ts";
import { exhaustive } from "npm:exhaustive"
import { addOrderRequestSchema, updateOrderRequestSchema } from "../schemas/orderRequestSchema.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { OrderEntity } from "../../../../domain/entities/OrderEntity.ts";

export class OrderController implements EntityControllerInterface{
  public constructor(
    private readonly orderRepository: OrderRepository,
    private readonly partRepository: PartRepository,
  ) {}

  public async getAll(): Promise<Response> {
    const listOrdersUsecase = new ListOrdersUsecase(
      this.orderRepository,
    );

    const result = await listOrdersUsecase.execute();

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
      return new Response("Order ID is required", { status: 400 });
    }

    const getOrderUsecase = new GetOrderUsecase(this.orderRepository);

    const result = await getOrderUsecase.execute(id);

    if (result instanceof OrderEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      OrderNotFoundError: () => new Response("OrderNotFoundError", { status: 404 }),
    });

  }

  public async create(request: Request): Promise<Response> {
    const addOrderUsecase = new AddOrderUsecase(
      this.orderRepository,
      this.partRepository,
    );

    const body = await request.json();

    const validation = addOrderRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const result = await addOrderUsecase.execute(validation.data);

    if (result instanceof OrderEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      PartNotFoundError: () => new Response("PartNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("id");

    if (!orderId) {
      return new Response("Order ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateOrderRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const updateOrderUsecase = new UpdateOrderUsecase(this.orderRepository, this.partRepository);
    const result = await updateOrderUsecase.execute(orderId, validation.data);

    if (result instanceof OrderEntity) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(result.name, {
      OrderNotFoundError: () => new Response("OrderNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Order ID is required", { status: 400 });
    }

    const deleteOrderUsecase = new DeleteOrderUsecase(
      this.orderRepository,
    );

    const result = await deleteOrderUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, {
        status: 204,
      });
    }

    return exhaustive(result.name, {
      OrderNotFoundError: () => new Response("OrderNotFoundError", { status: 404 }),
    });
  }
}
