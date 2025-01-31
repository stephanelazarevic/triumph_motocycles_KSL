import { z } from "npm:zod";
import { NotificationStatus, NotificationType } from "../../../../domain/enum/NotificationEnum.ts";

export const createNotificationRequestSchema = z.object({
    userId: z.string().uuid(),
    type: z.nativeEnum(NotificationType, { errorMap: () => ({ message: "Invalid notification type" }) }),
    message: z.string().min(1, "Message is required"),
    date: z.date({ coerce: true }),
    status: z.nativeEnum(NotificationStatus, { errorMap: () => ({ message: "Invalid notification status" }) }),
});
