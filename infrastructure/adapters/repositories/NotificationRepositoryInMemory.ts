import { NotificationRepository } from "../../../application/repositories/NotificationRepository.ts";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../domain/enum/NotificationEnum.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";

export class NotificationRepositoryInMemory implements NotificationRepository {
  public constructor(private notifications: NotificationEntity[]) {}

  public save(notification: NotificationEntity): Promise<void> {
    const index = this.notifications.findIndex(
      (notification) => notification.id === notification.id
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
      return notification.id === id;
    });

    return Promise.resolve(foundNotification ?? new NotificationNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    );
    return Promise.resolve();
  }

  public findRecentNotification(userId: string, type: NotificationType): Promise<NotificationEntity | NotificationNotFoundError> {
    const recentNotifications = this.notifications.filter(
      (notification) => notification.user.id === userId && notification.type === type
    );
  
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const foundNotification = recentNotifications.find((notification) => notification.date >= oneWeekAgo);
  
    return foundNotification ? Promise.resolve(foundNotification) : Promise.resolve(new NotificationNotFoundError());
  }

  public findNotificationsByStatus(status: NotificationStatus): Promise<NotificationEntity[]>{
    const statusNotifications = this.notifications.filter(
      (notification) => notification.status === status
    );

    return Promise.resolve(statusNotifications)
  }
}
