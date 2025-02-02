import { z } from "npm:zod";
import { NotificationStatus, NotificationType } from "../../../../domain/enum/NotificationEnum.ts";

export const createNotificationRequestSchema = z.object({
    userId: z.string().uuid().min(1, "User id is required"),
    type: z.nativeEnum(NotificationType, { errorMap: () => ({ message: "Invalid notification type" }) }).default(NotificationType.INFO),
    message: z.string().min(1, "Message is required"),
    date: z.date({ coerce: true }).min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
    status: z.nativeEnum(NotificationStatus, { errorMap: () => ({ message: "Invalid notification status" }) }).default(NotificationStatus.UNREAD),
});

export const updateNotificationRequestSchema = createNotificationRequestSchema.extend()