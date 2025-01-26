import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";
import { NotificationRepository } from "../../repositories/NotificationRepository.ts";

export class FindNotificationUsecase {
  constructor(private notificationRepository: NotificationRepository) {}

  public async execute(id: string): Promise<NotificationEntity | NotificationNotFoundError> {
    const existing = await this.notificationRepository.findOneById(id);
    if (!existing) {
      return new NotificationNotFoundError();
    }
    return existing;
  }
}
