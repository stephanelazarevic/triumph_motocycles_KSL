import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";
import { AddOrderCommand } from "../../../domain/types/OrderType.ts";
import type { OrderRepository } from "../../repositories/OrderRepository.ts";
import type { PartRepository } from "../../repositories/PartRepository.ts";

export class AddOrderUsecase {
  public constructor(
    private readonly orderRepository: OrderRepository,
    private readonly partRepository: PartRepository,
  ) {}

  public async execute(command: AddOrderCommand): Promise<OrderEntity | Error> {
    const part = await this.partRepository.findOneById(
        command.parts.partId,
    );

    if (part instanceof PartNotFoundError) {
        return part;
      }

    const order = OrderEntity.create({
      parts: command.parts,
      orderDate: command.orderDate,
      status: command.status,
      totalAmount: command.totalAmount,
    });

    await this.orderRepository.save(order);
    return order;
  }
}
