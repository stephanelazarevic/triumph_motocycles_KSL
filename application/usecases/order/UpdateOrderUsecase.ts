import { OrderRepository } from "../../repositories/OrderRepository.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { updateOrderCommand, PartQuantityToOrder } from "../../../domain/types/OrderType.ts";
import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { NotEnoughPartsInStockError } from "../../../domain/errors/NotEnoughPartsInStockError.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";

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

    const updatedParts: Array<PartQuantityToOrder> = [];

    if (command.parts) {

      for(const partToOrder of command.parts){
        const part = await this.partRepository.findOneById(partToOrder.partId);
        if (part instanceof Error) {
          return part;
        }

        const previousPart = order.parts.find(p => p.partId === part.id);
        if (previousPart) {
          part.stockQuantity += previousPart.quantity;
        }

        if (part.stockQuantity < partToOrder.quantity) {
          return new NotEnoughPartsInStockError();
        }

        updatedParts.push({ partId: part.id, quantity: partToOrder.quantity });
      }
      order.parts = updatedParts;
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

    if (command.parts) {
      for (const partUsedToOrder of updatedParts) { 
        const part = await this.partRepository.findOneById(partUsedToOrder.partId);
        if (!(part instanceof PartNotFoundError)) {
          part.stockQuantity -= partUsedToOrder.quantity;
          await this.partRepository.save(part);
        }
      }
    }

    return order;
  }
}
