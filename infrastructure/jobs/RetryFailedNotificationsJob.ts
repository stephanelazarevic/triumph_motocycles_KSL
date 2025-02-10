import { CronJob } from "cron";
import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase";

export class RetryFailedNotificationsCron {
  constructor(private readonly sendNotificationUsecase: SendNotificationUsecase) {}

  public start(): void {
    const cronJob = new CronJob("0 0 * * *", async () => { 
      try {
        console.log("🔄 Retrying failed notifications...");
        await this.sendNotificationUsecase.retryFailedNotifications();
        console.log("✅ Failed notifications retried!");
      } catch (error) {
        console.error("❌ Error while retrying failed notifications: ", error);
      }
    });

    cronJob.start();
  }
}