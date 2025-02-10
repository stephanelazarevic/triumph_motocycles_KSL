import { prisma } from "./config/prisma.db.ts";
import apiRouter from "./routes/apiRouter.ts";
import authenticationRouter from "./routes/authenticationRouter.ts";

import { sendNotificationsCron, retryFailedNotificationsCron } from "../deno/config/cronDependencies.ts";

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

sendNotificationsCron.start();
retryFailedNotificationsCron.start();

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