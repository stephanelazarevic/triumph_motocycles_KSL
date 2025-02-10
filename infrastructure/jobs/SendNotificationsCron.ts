import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import { SendNotificationUsecase } from "../../application/usecases/notification/SendNotificationUsecase.ts";

export class SendNotificationsCron {
  constructor(private readonly sendNotificationUsecase: SendNotificationUsecase) {}

  public start(): void {
    cron("0 0 * * *", async () => {
      try {
        console.log("🔔 Sending notifications...");
        await this.sendNotificationUsecase.execute();
        console.log("✅ Notifications processed!");
      } catch (error) {
        console.error("❌ Error while sending notifications: ", error);
      }
    });
  }
}
