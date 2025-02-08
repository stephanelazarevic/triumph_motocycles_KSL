import { EmailAddress } from "../../domain/value-objects/EmailAddress";

export interface EmailService {
    send(email: { to: EmailAddress; subject: string; body: string }): Promise<void>;
  }
  
  export class ResendEmailService implements EmailService {

    private readonly apiKey = "re_DaL2Ey92_6wjMQRP18r4wfCGGrNLUZR5k";

    async send(email: { to: EmailAddress; subject: string; body: string }): Promise<void> {

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "stephanelazarevic042@gmail.com", 
          to: email,
          subject: email.subject,
          text: email.body,
        }),
      });
  
      if (!response.ok) {
        console.error("❌ Erreur lors de l'envoi de l'email:", await response.text());
        throw new Error("Échec de l'envoi de l'email");
      }
  
      console.log(`📧 Email envoyé à ${email.to} via Resend`);

    }
  }
  