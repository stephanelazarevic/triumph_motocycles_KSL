import { Entity } from "./Entity.ts";
import { PartQuantityToOrder } from "../types/OrderType.ts";
import { OrderStatus } from "../enum/OrderEnum.ts";
import { JsonValue } from "@prisma/client/runtime/library";

export class OrderEntity extends Entity {
  private constructor(
    public parts: Array<PartQuantityToOrder>,
    public orderDate: Date,
    public status: OrderStatus,
    public totalAmount: number,
    id?: string
  ) {
    super(id);
  }

  public static create(params: {
    parts: Array<PartQuantityToOrder>,
    orderDate: Date,
    status: OrderStatus,
    totalAmount: number,
  }): OrderEntity {
    return new OrderEntity(
      params.parts,
      params.orderDate,
      params.status,
      params.totalAmount,
    );
  }

  static reconstitute(data: {
    id: string;
    parts: JsonValue,
    orderDate: Date,
    status: OrderStatus,
    totalAmount: number,
  }): OrderEntity {
    const parts = JSON.parse(JSON.stringify(data.parts)) as Array<PartQuantityToOrder>;

    return new OrderEntity(
      parts,
      data.orderDate,
      data.status,
      data.totalAmount,
      data.id
    );
  }
}
