import { OrderStatus } from "../../../../domain/enum/OrderEnum.ts";
import * as Prisma from "../../../database/prisma/generated/client-deno/deno/edge.ts";

export const mapOrderStatusToPrismaOrderStatus = (status: OrderStatus): Prisma.OrderStatus => {
  switch (status) {
    case OrderStatus.AWAITING:
      return Prisma.OrderStatus.awaiting;
    case OrderStatus.CONFIRMED:
      return Prisma.OrderStatus.confirmed;
    case OrderStatus.CANCELED:
      return Prisma.OrderStatus.canceled;  
    default:
      throw new Error(`Unknown type: ${status}`);
  }
}
