import { z } from "npm:zod";
import { NotificationStatus, NotificationType } from "../../../../domain/enum/NotificationEnum.ts";

const notificationSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  type: z.nativeEnum(NotificationType, {
    errorMap: () => ({ message: "Invalid notification type" })
  }).default(NotificationType.MAINTENANCE_REMINDER),
  message: z.string().min(1, "Message is required"),
  date: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  status: z.nativeEnum(NotificationStatus, {
    errorMap: () => ({ message: "Invalid notification status" })
  }).default(NotificationStatus.TO_SEND),
});

export const addNotificationRequestSchema = notificationSchema;
export const updateNotificationRequestSchema = notificationSchema.partial();
