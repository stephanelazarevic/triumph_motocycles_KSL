import { EmailAddress } from "../../domain/value-objects/EmailAddress";

export interface EmailService{
      
    send(email: { to: EmailAddress; subject: string; body: string }): Promise<void>;
}