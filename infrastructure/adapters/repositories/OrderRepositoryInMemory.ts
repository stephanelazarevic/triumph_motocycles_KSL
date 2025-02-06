import { OrderRepository } from "../../../application/repositories/OrderRepository.ts";
import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError.ts";

export class OrderRepositoryInMemory implements OrderRepository {
  public constructor(private orders: OrderEntity[]) {}

  public save(incident: OrderEntity): Promise<void> {
    const index = this.orders.findIndex((order) => order.id === order.id);
    if (index === -1) {
      this.orders.push(incident);
    } else {
      this.orders[index] = incident;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<OrderEntity[]> {
    return Promise.resolve(this.orders);
  }

  findOneById(id: string): Promise<OrderEntity | OrderNotFoundError> {
    const foundOrder = this.orders.find((order) => {
      return order.id === id;
    });

    return Promise.resolve(foundOrder ?? new OrderNotFoundError());
  }

  delete(id: string): Promise<void> {
    this.orders = this.orders.filter((order) => order.id !== id);
    return Promise.resolve();
  }
}
