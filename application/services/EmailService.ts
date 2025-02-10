import { NotificationEntity } from "../../domain/entities/NotificationEntity.ts";
import { EmailAddress } from "../../domain/value-objects/EmailAddress.ts";

export interface EmailService{
  
  send(email: { to: EmailAddress; subject: string; body: string }): Promise<void>;

  resendNotification(notification: NotificationEntity): Promise<void>;

}