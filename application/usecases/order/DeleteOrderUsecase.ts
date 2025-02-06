import { OrderRepository } from "../../repositories/OrderRepository.ts";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError.ts";

export class DeleteOrderUsecase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute(id: string): Promise<OrderNotFoundError | void> {
    const existingOrder = await this.orderRepository.findOneById(id);
    if (!existingOrder) {
      return new OrderNotFoundError();
    }

    await this.orderRepository.delete(id);
  }
}
