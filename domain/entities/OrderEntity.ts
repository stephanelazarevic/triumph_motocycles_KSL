import { Entity } from "./Entity.ts";
import { PartQuantityToOrder } from "../types/OrderType.ts";
import { OrderStatus } from "../enum/OrderEnum.ts";

export class OrderEntity extends Entity {
  private constructor(
    public parts: Array<PartQuantityToOrder>,
    public orderDate: Date,
    public status: OrderStatus,
    public totalAmount: number,
  ) {
    super();
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
}
