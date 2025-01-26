import { NotificationRepository } from "../../../application/repositories/NotificationRepository.ts";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";

export class NotificationRepositoryInMemory implements NotificationRepository {
  public constructor(private notifications: NotificationEntity[]) {}

  public save(notification: NotificationEntity): Promise<void> {
    const index = this.notifications.findIndex(
      (notification) => notification.identifier === notification.identifier
    );
    if (index === -1) {
      this.notifications.push(notification);
    } else {
      this.notifications[index] = notification;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<NotificationEntity[]> {
    return Promise.resolve(this.notifications);
  }

  public findOneById(id: string): Promise<NotificationEntity | NotificationNotFoundError> {
    const foundNotification = this.notifications.find((notification) => {
      return notification.identifier === id;
    });

    return Promise.resolve(foundNotification ?? new NotificationNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.notifications = this.notifications.filter(
      (notification) => notification.identifier !== id
    );
    return Promise.resolve();
  }
}
