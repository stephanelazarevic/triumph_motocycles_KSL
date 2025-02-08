import { NotificationRepository } from "../../application/repositories/NotificationRepository.ts";
import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase.ts";
import { NotificationStatus } from "../../domain/enum/NotificationEnum.ts";

export class RetryFailedNotificationsJob {
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sendNotificationUsecase: SendNotificationUsecase,
  ) {}

  public async execute(): Promise<void> {
    console.log("🔄 Retry job starting...");

    const failedNotifications = await this.notificationRepository.findNotificationsByStatus(NotificationStatus.FAILED);

    if (failedNotifications.length === 0) {
      console.log("✅ No failed notifications.");
      return;
    }

    for (const notification of failedNotifications) {
      try {

        await this.sendNotificationUsecase.resend(notification);

        console.log(`✅ Notification ${notification.id} send !`);
      } catch (error) {
        console.error(`❌ Retry failed for notification ${notification.id}:`, error.message);
      }
    }
  }
}
