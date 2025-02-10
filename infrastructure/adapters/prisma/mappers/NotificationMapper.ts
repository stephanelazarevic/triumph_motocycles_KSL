import { NotificationStatus, NotificationType } from "../../../../domain/enum/NotificationEnum.ts";
import * as Prisma from "../../../database/prisma/generated/client-deno/deno/edge.ts";

export const mapNotificationTypeToPrismaNotificationType = (type: NotificationType): Prisma.NotificationType => {
  switch (type) {
    case NotificationType.LOW_STOCK_ALERT:
      return Prisma.NotificationType.low_stock_alert;
    case NotificationType.MAINTENANCE_REMINDER:
      return Prisma.NotificationType.maintenance_reminder;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export const mapNotificationStatusToPrismaNotificationStatus = (status: NotificationStatus): Prisma.NotificationStatus => {
  switch (status) {
    case NotificationStatus.TO_SEND:
      return Prisma.NotificationStatus.to_send;
    case NotificationStatus.PENDING:
      return Prisma.NotificationStatus.pending;
    case NotificationStatus.SENT:
      return Prisma.NotificationStatus.sent;
    case NotificationStatus.FAILED:
      return Prisma.NotificationStatus.failed;  
    default:
      throw new Error(`Unknown type: ${status}`);
  }
}
