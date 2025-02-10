import { EmailAddress } from "../../domain/value-objects/EmailAddress.ts";
import { EmailNotSentError } from "../../domain/errors/EmailNotSentError.ts"
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { EmailService } from "../../application/services/EmailService.ts";
import { NotificationEntity } from "../../domain/entities/NotificationEntity.ts";

const env = await load();
const MAIL_API_KEY = env.MAIL_API_KEY;

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
          to: email.to,
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

    async resendNotification(notification: NotificationEntity): Promise<void> {
      console.log(`🔄 Retrying email for notification ID: ${notification.id}...`);
      try {
        await this.send({
          to: notification.user.emailAddress,
          subject: `Re: ${notification.message}`,
          body: notification.message,
        });
  
        console.log(`✅ Retry success for notification ID: ${notification.id}`);
      } catch (error) {
        console.error(`❌ Retry failed for notification ID: ${notification.id}`, error.message);
      }
  }
}
