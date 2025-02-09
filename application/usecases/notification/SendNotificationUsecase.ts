import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { EmailService } from "../../../infrastructure/services/EmailService.ts";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationType, NotificationStatus } from "../../../domain/enum/NotificationEnum.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts"
import { getSecret } from "../../../infrastructure/vaultClient.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { AdminIdNotFoundError } from "../../../domain/errors/AdminIdNotFoundError.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { NotificationSentRecentlyError } from "../../../domain/errors/NotificationSentRecentlyError.ts";
import { NotificationNotSentError } from "../../../domain/errors/NotificationNotSentError.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";

const env = await load();
const adminSecretPath = env.ADMIN_SECRET_PATH;

export class SendNotificationUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly partRepository: PartRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: EmailService,
  ) {}

  public async execute(): Promise<void> {

    let adminId: string;
    try {
      const secretData = await getSecret(adminSecretPath);
      adminId = secretData.adminId;
    } catch (error) {
      throw new AdminIdNotFoundError();
    }

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const scheduledMaintenances = await this.maintenanceRepository.findScheduledMaintenances(thirtyDaysLater);

    for (const maintenance of scheduledMaintenances) {

      const message = `Votre moto ${maintenance.motorcycle.model} doit passer un entretien de contrôle avant le ${thirtyDaysLater} !`;
      let toSendId: string;
      let toSendEmail: EmailAddress;

      if (MotorcycleEntity.isAssignedToClient(maintenance.motorcycle.clientId)) {
        const client = await this.clientRepository.findOneById(maintenance.motorcycle.clientId!);
        if (client instanceof Error) {
          throw new ClientNotFoundError();
        } else {
            toSendId = client.id;
            toSendEmail = client.user.emailAddress;
          }
      } else if (MotorcycleEntity.isAssignedToEntreprise(maintenance.motorcycle.enterpriseId)) {
          const enterprise = await this.enterpriseRepository.findOneById(maintenance.motorcycle.enterpriseId!);
          if (enterprise instanceof Error) {
            throw new EnterpriseNotFoundError();
          } else {
              toSendId = enterprise.id;
              toSendEmail = enterprise.user.emailAddress;
          }
        } else {
          const adminUser = await this.userRepository.findOneById(adminId);
          if (adminUser instanceof Error) {
            throw new UserNotFoundError();
          } else {
            toSendId = adminUser.id;
            toSendEmail = adminUser.emailAddress;
          }
        }

      await this.sendNotification(
        toSendId,
        NotificationType.MAINTENANCE_REMINDER,
        message,
        toSendEmail,
        "Entretien Moto Requis",
        `Bonjour, il est temps de faire l'entretien de votre moto ${maintenance.motorcycle.model}. Rendez-vous à votre garage habituel.`
      );
    }

    const user = await this.userRepository.findOneById(adminId);
      if (user instanceof Error) {
        throw new UserNotFoundError();
      }

    const lowStockParts = await this.partRepository.findPartsBelowStock(5);

    for (const part of lowStockParts) {

      const message = `Attention ! Le stock de ${part.reference} est bas, (${part.stockQuantity} restant !)`;

      await this.sendNotification(
        adminId,
        NotificationType.LOW_STOCK_ALERT,
        message,
        user.emailAddress,
        "Alerte Stock Faible",
        `Le stock de ${part.reference} est critique (${part.stockQuantity} restant !). Merci de passer commande rapidement.`
      );
    }
  }

  public async sendNotification(
    userId: string,
    type: NotificationType,
    message: string,
    email: EmailAddress,
    emailSubject: string,
    emailBody: string
  ): Promise<void> {

    const existingNotification = await this.notificationRepository.findRecentNotification(userId, type);
    if (existingNotification) {
      throw new NotificationSentRecentlyError();
    }

    const user = await this.userRepository.findOneById(userId);
    if (user instanceof Error) {
      throw new UserNotFoundError();
    }

    const notification = NotificationEntity.create({
      user,
      type,
      message,
      date: new Date(),
      status: NotificationStatus.PENDING,
    });

    await this.notificationRepository.save(notification);

    try {
      await this.emailService.send({
        to: email,
        subject: emailSubject,
        body: emailBody,
      });

      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);

    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      await this.notificationRepository.save(notification);

      throw new NotificationNotSentError();
    }
  }

  public async resend(notification: NotificationEntity): Promise<void> {
    try {
      await this.emailService.send({
        to: notification.user.emailAddress,
        subject: `Re: ${notification.message}`,
        body: notification.message,
      });

      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);

      console.log(`✅ Retry success for notification ID: ${notification.id}`);
    } catch (error) {
      console.error(`❌ Retry failed for notification ID: ${notification.id}`, error.message);
    }
  }
}
