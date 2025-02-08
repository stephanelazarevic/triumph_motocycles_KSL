import { EmailAddress } from "../../domain/value-objects/EmailAddress";
import { EmailNotSentError } from "../../domain/errors/EmailNotSentError.ts"

import { config } from "https://deno.land/std@0.203.0/dotenv/mod.ts";
const env = config();
const MAIL_API_KEY = env.MAIL_API_KEY;


export interface EmailService {
    send(email: { to: EmailAddress; subject: string; body: string }): Promise<void>;
  }
  
  export class ResendEmailService implements EmailService {

    private readonly apiKey = MAIL_API_KEY;

    async send(email: { to: EmailAddress; subject: string; body: string }): Promise<void> {

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "admin.ksl@gmail.com", 
          to: email,
          subject: email.subject,
          text: email.body,
        }),
      });
  
      if (!response.ok) {
        console.error("❌ Error while sending email:", await response.text());
        throw new EmailNotSentError();
      }
  
      console.log(`📧 Email sent to ${email.to} !`);

    }
  }
  