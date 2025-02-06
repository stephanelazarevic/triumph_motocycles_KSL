import { OrderRepository } from "../../repositories/OrderRepository.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { updateOrderCommand } from "../../../domain/types/OrderType.ts";
import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";

export class UpdateOrderUsecase {
  constructor(
    private orderRepository: OrderRepository,
    private partRepository: PartRepository,
  ) {}

  public async execute(orderId: string, command: updateOrderCommand): Promise<OrderEntity | Error> {
    const order = await this.orderRepository.findOneById(orderId);
    if (order instanceof Error) {
      return order;
    }

    if (command.parts?.partId) {
        const part = await this.partRepository.findOneById(command.parts.partId);
        if (part instanceof Error) {
          return part;
        }
        order.parts.partId = part.id;
      }

    if (command.parts?.quantity) {
      order.parts.quantity = command.parts.quantity;
    }
    if (command.orderDate) {
      order.orderDate = command.orderDate;
    }
    if (command.status) {
      order.status = command.status;
    }
    if (command.totalAmount) {
      order.totalAmount = command.totalAmount;
    }

    order.markAsUpdated();
    await this.orderRepository.save(order);

    return order;
  }
}
