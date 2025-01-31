import { NotificationEntity } from "../../domain/entities/NotificationEntity.ts";
import { NotificationNotFoundError } from "../../domain/errors/NotificationNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface NotificationRepository extends EntityRepositoryInterface<NotificationEntity>{
  save(notification: NotificationEntity): Promise<void>;
  findAll(): Promise<NotificationEntity[]>;
  findOneById(id: string): Promise<NotificationEntity | NotificationNotFoundError>;
  delete(id: string): Promise<void>;
}
