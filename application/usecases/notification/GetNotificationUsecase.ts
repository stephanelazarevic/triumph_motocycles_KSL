import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";
import { NotificationRepository } from "../../repositories/NotificationRepository.ts";

export class GetNotificationUsecase {
  constructor(private notificationRepository: NotificationRepository) {}

  public async execute(id: string): Promise<NotificationEntity | NotificationNotFoundError> {
    const existingNotification = await this.notificationRepository.findOneById(id);
    if (!existingNotification) {
      return new NotificationNotFoundError();
    }

    return existingNotification;
  }
}
