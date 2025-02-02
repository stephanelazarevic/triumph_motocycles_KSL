import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";

export class UpdateNotificationUsecase {
  constructor(private notificationRepository: NotificationRepository) {}

  public async execute(notificationId: string, updatedNotification: NotificationEntity): Promise<NotificationNotFoundError | void> {
    const notification = await this.notificationRepository.findOneById(notificationId);
    if (notification instanceof Error) {
      return notification;
    }

    notification.user = updatedNotification.user
    notification.notificationType = updatedNotification.notificationType
    notification.message = updatedNotification.message
    notification.date = updatedNotification.date
    notification.notificationStatus = updatedNotification.notificationStatus

    await this.notificationRepository.save(notification);
  }
}
