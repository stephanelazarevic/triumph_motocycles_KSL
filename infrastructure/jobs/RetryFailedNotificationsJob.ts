import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase.ts";

export class RetryFailedNotificationsCron {
  constructor(private readonly sendNotificationUsecase: SendNotificationUsecase) {}

  public start(): void {
    cron("0 0 * * *", async () => {
      try {
        console.log("🔄 Retrying failed notifications...");
        await this.sendNotificationUsecase.retryFailedNotifications();
        console.log("✅ Failed notifications retried!");
      } catch (error) {
        console.error("❌ Error while retrying failed notifications: ", error);
      }
    });
  }
}