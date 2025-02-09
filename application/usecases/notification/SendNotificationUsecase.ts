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
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { AdminIdNotFoundError } from "../../../domain/errors/AdminIdNotFoundError.ts";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError.ts";
import { NotificationSentRecentlyError } from "../../../domain/errors/NotificationSentRecentlyError.ts";
import { NotificationNotSentError } from "../../../domain/errors/NotificationNotSentError.ts";

const env = config();
const adminSecretPath = env.ADMIN_SECRET_PATH;

export class SendNotificationUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly partRepository: PartRepository,
    private readonly userRepository: UserRepository,
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
      let userId: string;

      if (MotorcycleEntity.isAssignedToClient(maintenance.motorcycle.clientId)) {
          userId = maintenance.motorcycle.clientId ?? adminId;
      } else if (MotorcycleEntity.isAssignedToDriver(maintenance.motorcycle.driverId)) {
        userId = maintenance.motorcycle.driverId ?? adminId;
      } else {
        userId = adminId;
      }

      const user = await this.userRepository.findOneById(userId);
      if (user instanceof Error) {
        throw new UserNotFoundError();
      }

      await this.sendNotification(
        userId,
        NotificationType.MAINTENANCE_REMINDER,
        message,
        user.emailAddress,
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
