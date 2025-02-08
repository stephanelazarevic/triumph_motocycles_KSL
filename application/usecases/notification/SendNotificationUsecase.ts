import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { EmailService } from "../../../infrastructure/services/EmailService.ts";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { NotificationType, NotificationStatus } from "../../../domain/enum/NotificationEnum.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts"

export class SendNotificationUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly partRepository: PartRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: EmailService,
  ) {}

  public async execute(): Promise<void> {
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const scheduledMaintenances = await this.maintenanceRepository.findScheduledMaintenances(thirtyDaysLater);

    for (const maintenance of scheduledMaintenances) {

      const message = `Votre moto ${maintenance.motorcycle.model} doit être entretenue avant le ${thirtyDaysLater} !`;
      let userId: string;

      if (MotorcycleEntity.isAssignedToClient(maintenance.motorcycle.clientId)) {
          userId = maintenance.motorcycle.clientId ?? "adminId";
      } else if (MotorcycleEntity.isAssignedToDriver(maintenance.motorcycle.driverId)) {
        userId = maintenance.motorcycle.driverId ?? "adminId";
      } else {
        userId = "adminId";
      }

      const user = await this.userRepository.findOneById(userId);
      if (user instanceof Error) {
        throw new Error("Aucun user trouvé avec cet ID");
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

    const stockManagerId = "stockManagerId";
    const user = await this.userRepository.findOneById(stockManagerId);
      if (user instanceof Error) {
        throw new Error("Aucun user trouvé avec cet ID");
      }

    const lowStockParts = await this.partRepository.findPartsBelowStock(5);

    for (const part of lowStockParts) {

      const message = `Attention ! Le stock de ${part.reference} est bas, (${part.stockQuantity} restant !)`;
      
      await this.sendNotification(
        stockManagerId, 
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
      console.log(`⏳ Notification déjà envoyée il y a moins d'une semaine pour ${type} !`);
      throw new Error("Notification déjà envoyée récemment !");
    }

    const user = await this.userRepository.findOneById(userId);
    if (user instanceof Error) {
      throw Error("Cet utilisateur n'existe pas/plus !");
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
  
      console.log(`✅ Notification envoyée à ${user.firstname} ${user.lastname} et mise à jour !`);
    } catch (error) {
      console.error(`❌ Échec de l'envoi de la notification à ${user.firstname} ${user.lastname} !`);
      
      notification.status = NotificationStatus.FAILED;
      await this.notificationRepository.save(notification);
    }

    console.log(`📨 Notification envoyée : ${message}`);
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
  
      console.log(`✅ Retry réussi pour la notification ID: ${notification.id}`);
    } catch (error) {
      console.error(`❌ Échec du retry pour notification ID: ${notification.id}`, error.message);
    }
  }
}
