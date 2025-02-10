import { SendNotificationUsecase } from "../../../../application/usecases/notification/SendNotificationUsecase.ts";
import { ClientRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/ClientRepositoryPrisma.ts";
import { EnterpriseRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/EnterpriseRepositoryPrisma.ts";
import { MaintenanceRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/MaintenanceRepositoryPrisma.ts";
import { NotificationRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/NotificationRepositoryPrisma.ts";
import { PartRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/PartRepositoryPrisma.ts";
import { UserRepositoryPrisma } from "../../../../infrastructure/adapters/prisma/UserRepositoryPrisma.ts";
import { RetryFailedNotificationsCron } from "../../../../infrastructure/jobs/RetryFailedNotificationsJob.ts";
import { SendNotificationsCron } from "../../../../infrastructure/jobs/SendNotificationsCron.ts";
import { emailService } from "../../deno/config/servicesDependencies.ts";
import { prisma } from "./prisma.db.ts";

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