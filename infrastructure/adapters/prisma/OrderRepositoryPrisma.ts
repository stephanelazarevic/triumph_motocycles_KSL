import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { OrderRepository } from "../../../application/repositories/OrderRepository.ts";
import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { mapOrderStatusToPrismaOrderStatus } from "./mappers/OrderMapper.ts";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError.ts";

export class OrderRepositoryPrisma implements OrderRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(order: OrderEntity): Promise<void> {
    await this.prisma.order.create({
      data: {
        id: order.id,
        parts: order.parts,
        orderDate: order.orderDate,
        status: mapOrderStatusToPrismaOrderStatus(order.status),
        totalAmount: order.totalAmount
      }
    });
  }

  public async findAll(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany();

    return orders.map(order =>
      OrderEntity.reconstitute({
        id: order.id,
        parts: order.parts,
        orderDate: order.orderDate,
        status: order.status,
        totalAmount: order.totalAmount
      })
    );
  }

  public async findOneById(id: string): Promise<OrderEntity | OrderNotFoundError> {
    const order = await this.prisma.order.findUnique(
        { where: { id } }
    );

    if (!order) {
      return new OrderNotFoundError();
    }

    return OrderEntity.reconstitute({
        id: order.id,
        parts: order.parts,
        orderDate: order.orderDate,
        status: order.status,
        totalAmount: order.totalAmount
      });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id }
    });
  }
}
