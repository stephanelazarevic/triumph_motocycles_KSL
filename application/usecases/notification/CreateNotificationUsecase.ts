import { NotificationEntity, NotificationStatus, NotificationType } from "../../../domain/entities/NotificationEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";

export class CreateNotificationUsecase {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(
    userId: string,
    type: NotificationType,
    message: string,
    date: Date,
    status: NotificationStatus
  ) {
    const user = await this.userRepository.findById(
      userId
    );

    if (!(user instanceof UserEntity)) {
      return new UserNotFoundError();
    }

    const notification = NotificationEntity.create(
      user,
      type,
      message,
      date,
      status,
    );

    await this.notificationRepository.save(notification);
  }
}
