import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { AddNotificationCommand } from "../../../domain/types/NotificationType.ts";
import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";

export class AddNotificationUsecase {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(command: AddNotificationCommand): Promise<NotificationEntity | Error> {
    const user = await this.userRepository.findOneById(command.userId);

    if (user instanceof UserNotFoundError) {
      return user;
    }

    const notification = NotificationEntity.create({
      user,
      type: command.type,
      message: command.message,
      date: command.date,
      status: command.status,
    });

    await this.notificationRepository.save(notification);
    return notification;
  }
}
