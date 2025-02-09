import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { NotEnoughPartsInStockError } from "../../../domain/errors/NotEnoughPartsInStockError.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";
import { AddOrderCommand, PartQuantityToOrder } from "../../../domain/types/OrderType.ts";
import type { OrderRepository } from "../../repositories/OrderRepository.ts";
import type { PartRepository } from "../../repositories/PartRepository.ts";

export class AddOrderUsecase {
  public constructor(
    private readonly orderRepository: OrderRepository,
    private readonly partRepository: PartRepository,
  ) {}

  public async execute(command: AddOrderCommand): Promise<OrderEntity | Error> {

    const updatedParts: Array<PartQuantityToOrder> = [];

    for(const partToOrder of command.parts){
      const part = await this.partRepository.findOneById(partToOrder.partId,);
      if (part instanceof PartNotFoundError) {
        return part;
      }

      if (part.stockQuantity < partToOrder.quantity) {
        return new NotEnoughPartsInStockError();
      }
      
      updatedParts.push({ partId: part.id, quantity: partToOrder.quantity });
    }

    const order = OrderEntity.create({
      parts: updatedParts,
      orderDate: command.orderDate,
      status: command.status,
      totalAmount: command.totalAmount,
    });

    await this.orderRepository.save(order);

    for (const partUsedToOrder of updatedParts) {
      const part = await this.partRepository.findOneById(partUsedToOrder.partId);
      if (!(part instanceof PartNotFoundError)) {
        part.stockQuantity -= partUsedToOrder.quantity;
        await this.partRepository.save(part);
      }
    }

    return order;
  }
}
