import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";

export class UpdateNotificationUsecase {
  constructor(private notificationRepository: NotificationRepository) {}

  public async execute(notification: NotificationEntity): Promise<NotificationNotFoundError | void> {
    const existing = await this.notificationRepository.findOneById(notification.id);
    if (!existing) {
      return new NotificationNotFoundError();
    }
    await this.notificationRepository.save(notification);
  }
}
