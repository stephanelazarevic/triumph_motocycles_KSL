import { NotificationRepository } from "../../application/repositories/NotificationRepository.ts";
import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase.ts";
import { NotificationStatus } from "../../domain/enum/NotificationEnum.ts";

export class RetryFailedNotificationsJob {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sendNotificationUsecase: SendNotificationUsecase,
  ) {}

  public async execute(): Promise<void> {
    console.log("🔄 Démarrage du job de retry des notifications échouées...");

    const failedNotifications = await this.notificationRepository.findNotificationsByStatus(NotificationStatus.FAILED);

    if (failedNotifications.length === 0) {
      console.log("✅ Aucune notification en échec à retenter.");
      return;
    }

    for (const notification of failedNotifications) {
      try {
        console.log(`🔄 Retentative de la notification ID: ${notification.id}`);

        await this.sendNotificationUsecase.resend(notification);

        console.log(`✅ Notification ID ${notification.id} envoyée avec succès !`);
      } catch (error) {
        console.error(`❌ Échec du retry pour la notification ID ${notification.id}:`, error.message);
      }
    }
  }
}
