import { UserEntity } from "./UserEntity.ts";
import { NotificationType, NotificationStatus } from "../enum/NotificationEnum.ts";
import { Entity } from "./Entity.ts";

export class NotificationEntity extends Entity {
  private constructor(
    public user: UserEntity,
    public type: NotificationType,
    public message: string,
    public date: Date,
    public status: NotificationStatus,
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

  static reconstitute(data: {
    id: string;
    user: UserEntity;
    type: string;
    message: string;
    date: Date;
    status: string;
  }): NotificationEntity {
    return new NotificationEntity(
      data.user,
      NotificationType[data.type],
      data.message,
      data.date,
      NotificationStatus[data.status],
      data.id
    );
  }
}
