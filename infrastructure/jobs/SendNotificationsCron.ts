import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase.ts";
import { NotificationStatus } from "../../domain/enum/NotificationEnum.ts";
import { NotificationRepository } from "../../application/repositories/NotificationRepository.ts";
import { EmailService } from "../services/EmailService.ts";
import { MaintenanceRepository } from "../../application/repositories/MaintenanceRepository.ts";
import { PartRepository } from "../../application/repositories/PartRepository.ts";
import { CronJob } from "cron"; 
import { UserRepository } from "../../application/repositories/UserRepository.ts";

export class SendNotificationsCron {
  private sendNotificationUsecase: SendNotificationUsecase;

  constructor(
    private maintenanceRepository: MaintenanceRepository,
    private partRepository: PartRepository,
    private userRepository: UserRepository,
    private notificationRepository: NotificationRepository,
    private emailService: EmailService
  ) {
    this.sendNotificationUsecase = new SendNotificationUsecase(
      this.maintenanceRepository,
      this.partRepository,
      this.userRepository,
      this.notificationRepository,
      this.emailService,
    );
  }

  public start(): void {
    // Cron pour envoyer les notifications tous les jours à minuit
    const cronJob = new CronJob("0 0 * * *", async () => {
      try {
        console.log("🔔 Envoi des notifications planifiées...");
        await this.sendNotificationUsecase.execute();

        const toSendNotifications = await this.notificationRepository.findNotificationsByStatus(NotificationStatus.TO_SEND);
        for (const notification of toSendNotifications) {
          console.log(`📤 Envoi manuel notification ID: ${notification.id}`);
          
          await this.sendNotificationUsecase.sendNotification(
            notification.user.id,
            notification.type,
            notification.message,
            notification.user.emailAddress,
            `Notification : ${notification.type}`,
            notification.message
          );
        }

        console.log("✅ Notifications envoyées et statut mis à jour");
      } catch (error) {
        console.error("❌ Erreur lors de l'envoi des notifications : ", error);
      }
    });

    cronJob.start();
  }
}
