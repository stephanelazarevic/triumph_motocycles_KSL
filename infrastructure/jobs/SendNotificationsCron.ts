import { CronJob } from "cron";
import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase";

export class SendNotificationsCron {
  constructor(private readonly sendNotificationUsecase: SendNotificationUsecase) {}

  public start(): void {
    const cronJob = new CronJob("0 0 * * *", async () => {
      try {
        console.log("🔔 Sending notifications...");
        await this.sendNotificationUsecase.execute();
        console.log("✅ Notifications processed!");
      } catch (error) {
        console.error("❌ Error while sending notifications: ", error);
      }
    });

    cronJob.start();
  }
}
