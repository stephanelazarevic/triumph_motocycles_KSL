import { UserEntity } from "./UserEntity.ts";
import { NotificationType, NotificationStatus } from "../enum/NotificationEnum.ts";

export class NotificationEntity {
  private constructor(
    public readonly identifier: string,
    public readonly user: UserEntity,
    public readonly type: NotificationType,
    public readonly message: string,
    public readonly date: Date,
    public readonly status: NotificationStatus,
  ) {}

  public static create(
    user: UserEntity,
    type: NotificationType,
    message: string,
    date: Date,
    status: NotificationStatus,
  ) {
    const identifier = crypto.randomUUID();

    return new NotificationEntity(
      identifier,
      user,
      type,
      message,
      date,
      status
    );
  }
}
