import { prisma } from "./config/prisma.db.ts";
import apiRouter from "./routes/apiRouter.ts";
import authenticationRouter from "./routes/authenticationRouter.ts";

import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { SendNotificationUsecase } from "../../../application/usecases/notification/SendNotificationUsecase.ts";
import { SendNotificationsCron } from "../../../infrastructure/jobs/SendNotificationsCron.ts";
import { RetryFailedNotificationsCron } from "../../../infrastructure/jobs/RetryFailedNotificationsJob.ts";
import { MaintenanceRepositoryPrisma } from "../../../infrastructure/adapters/prisma/MaintenanceRepositoryPrisma.ts";
import { PartRepositoryPrisma } from "../../../infrastructure/adapters/prisma/PartRepositoryPrisma.ts";
import { UserRepositoryPrisma } from "../../../infrastructure/adapters/prisma/UserRepositoryPrisma.ts";
import { ClientRepositoryPrisma } from "../../../infrastructure/adapters/prisma/ClientRepositoryPrisma.ts";
import { EnterpriseRepositoryPrisma } from "../../../infrastructure/adapters/prisma/EnterpriseRepositoryPrisma.ts";
import { NotificationRepositoryPrisma } from "../../../infrastructure/adapters/prisma/NotificationRepositoryPrisma.ts";
import { EmailService } from "../../../application/services/EmailService.ts";
import { ResendEmailService } from "../../../infrastructure/services/ResendEmailService.ts";
import { logger } from './middleware/logger.ts'
import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { cors } from "https://deno.land/x/hono@v3.11.4/middleware.ts";

const app = new Hono();

// DB connection
try {
  await prisma.$connect();
  console.log('✅ Successfully connected to database');
} catch (error) {
  console.error('❌ Database connection error:', error);
  Deno.exit(1);
} finally {
  await prisma.$disconnect();
}


// lancement des cron
const emailService: EmailService = new ResendEmailService();

const sendNotificationUsecase = new SendNotificationUsecase(
  new MaintenanceRepositoryPrisma(prisma),
  new PartRepositoryPrisma(prisma),
  new UserRepositoryPrisma(prisma),
  new ClientRepositoryPrisma(prisma),
  new EnterpriseRepositoryPrisma(prisma),
  new NotificationRepositoryPrisma(prisma),
  emailService
);

const sendNotificationsCron = new SendNotificationsCron(sendNotificationUsecase);
const retryFailedNotificationsCron = new RetryFailedNotificationsCron(sendNotificationUsecase);

sendNotificationsCron.start();
retryFailedNotificationsCron.start();

app.use(oakCors({
// CORS
app.use("/*", cors({
  origin: "http://localhost:8080",
  credentials: true,
}));

// Logger
app.use("*", logger);

// routes
app.route("/api", apiRouter);
app.route("/api", authenticationRouter);

// Start server
Deno.serve({ port: 8000 }, app.fetch);