import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";

export class DeleteNotificationUsecase {
  constructor(private notificationRepository: NotificationRepository) {}

  public async execute(id: string): Promise<NotificationNotFoundError | void> {
    const existingNotification = await this.notificationRepository.findOneById(id);
    if (!existingNotification) {
      return new NotificationNotFoundError();
    }

    await this.notificationRepository.delete(id);
  }
}
