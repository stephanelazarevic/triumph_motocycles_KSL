import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import type { OrderRepository } from "../../repositories/OrderRepository.ts";

export class ListOrdersUsecase {
  public constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  public async execute(): Promise<OrderEntity[]> {
    return await this.orderRepository.findAll();
  }
}
