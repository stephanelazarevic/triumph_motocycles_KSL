import { UserEntity } from "./UserEntity.ts";
import { NotificationType, NotificationStatus } from "../enum/NotificationEnum.ts";

export class NotificationEntity {
  private constructor(
    public identifier: string,
    public user: UserEntity,
    public type: NotificationType,
    public message: string,
    public date: Date,
    public status: NotificationStatus,
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
