import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import type { NotificationRepository } from "../../repositories/NotificationRepository.ts";

export class FindAllNotificationsUsecase {
  public constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  public async execute(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.findAll();
  }
}
