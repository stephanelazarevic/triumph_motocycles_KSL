import { NotificationEntity } from "../../domain/entities/NotificationEntity.ts";
import { NotificationNotFoundError } from "../../domain/errors/NotificationNotFoundError.ts";

export interface NotificationRepository {
  save(notification: NotificationEntity): Promise<void>;
  findAll(): Promise<NotificationEntity[]>;
  findOneById(id: string): Promise<NotificationEntity | NotificationNotFoundError>;
  delete(id: string): Promise<void>;
}
