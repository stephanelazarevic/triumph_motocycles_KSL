import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError.ts";
import { OrderRepository } from "../../repositories/OrderRepository.ts";

export class GetOrderUsecase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute(id: string): Promise<OrderEntity | OrderNotFoundError> {
    const existing = await this.orderRepository.findOneById(id);
    if (!existing) {
      return new OrderNotFoundError();
    }
    return existing;
  }
}
