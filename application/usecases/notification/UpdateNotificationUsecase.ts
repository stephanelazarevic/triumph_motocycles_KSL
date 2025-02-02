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
    notification.type = updatedNotification.type
    notification.message = updatedNotification.message
    notification.date = updatedNotification.date
    notification.status = updatedNotification.status

    await this.notificationRepository.save(notification);
  }
}
