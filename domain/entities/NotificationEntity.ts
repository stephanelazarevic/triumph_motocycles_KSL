import { UserEntity } from "./UserEntity.ts";

export enum NotificationType {
    INFO = "info",
    ALERTE = "alerte",
    ERREUR = "erreur",
}

export enum NotificationStatus {
    READ = "read",
    UNREAD = "unread",
}

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
