import { UserEntity } from "./UserEntity.ts";
import { NotificationType, NotificationStatus } from "../enum/NotificationEnum.ts";
import { Entity } from "./Entity.ts";

export class NotificationEntity extends Entity {
  private constructor(
    public readonly user: UserEntity,
    public readonly type: NotificationType,
    public readonly message: string,
    public readonly date: Date,
    public readonly status: NotificationStatus,
  ) {
    super();
  }

  public static create( params: {
    user: UserEntity;
    type: NotificationType;
    message: string;
    date: Date;
    status: NotificationStatus;
  }) {
    return new NotificationEntity(
      params.user,
      params.type,
      params.message,
      params.date,
      params.status
    );
  }
}
