import { NotificationStatus, NotificationType } from "../enum/NotificationEnum.ts";

export interface AddNotificationCommand {
  userId: string,
  type: NotificationType,
  message: string,
  date: Date,
  status: NotificationStatus
}

export interface UpdateNotificationCommand extends Partial<AddNotificationCommand> {}
