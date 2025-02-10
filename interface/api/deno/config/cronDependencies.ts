import { SendNotificationUsecase } from "../../../../application/usecases/notification/SendNotificationUsecase";
import { ClientRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/ClientRepositoryPrisma";
import { EnterpriseRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/EnterpriseRepositoryPrisma";
import { MaintenanceRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/MaintenanceRepositoryPrisma";
import { NotificationRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/NotificationRepositoryPrisma";
import { PartRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/PartRepositoryPrisma";
import { UserRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/UserRepositoryPrisma";
import { RetryFailedNotificationsCron } from "../../../../infrastructure/jobs/RetryFailedNotificationsJob";
import { SendNotificationsCron } from "../../../../infrastructure/jobs/SendNotificationsCron";
import { emailService } from "../../deno/config/servicesDependencies";
import { prisma } from "./prisma.db";

// lancement des cron

const sendNotificationUsecase = new SendNotificationUsecase(
  new MaintenanceRepositoryPrisma(prisma),
  new PartRepositoryPrisma(prisma),
  new UserRepositoryPrisma(prisma),
  new ClientRepositoryPrisma(prisma),
  new EnterpriseRepositoryPrisma(prisma),
  new NotificationRepositoryPrisma(prisma),
  emailService
);

export const sendNotificationsCron = new SendNotificationsCron(sendNotificationUsecase);
export const retryFailedNotificationsCron = new RetryFailedNotificationsCron(sendNotificationUsecase);