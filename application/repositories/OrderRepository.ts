import { OrderEntity } from "../../domain/entities/OrderEntity.ts";
import { OrderNotFoundError } from "../../domain/errors/OrderNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface OrderRepository extends EntityRepositoryInterface<OrderEntity> {
  save(maintenance: OrderEntity): Promise<void>;
  findAll(): Promise<OrderEntity[]>;
  findOneById(id: string): Promise<OrderEntity | OrderNotFoundError>;
  delete(id: string): Promise<void>;
}
