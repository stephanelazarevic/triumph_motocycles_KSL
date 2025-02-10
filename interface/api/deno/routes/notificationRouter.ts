import { Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { maintenanceRepository, notificationRepository, partRepository, userRepository, clientRepository, enterpriseRepository } from "../config/repositoriesDependencies.ts";
import { NotificationController } from "../controllers/NotificationController.ts";
import { emailService } from "../config/servicesDependencies.ts";
const notificationRouter = new Hono();

const notificationController = new NotificationController(maintenanceRepository, partRepository, notificationRepository, userRepository, clientRepository, enterpriseRepository, emailService);

notificationRouter.get("/", (context) => notificationController.getAll(context));
notificationRouter.get("/",       (context) => notificationController.getAll(context));
notificationRouter.get("/:id",    (context) => notificationController.getById(context));
notificationRouter.post("/",      (context) => notificationController.create(context));
notificationRouter.put("/:id",    (context) => notificationController.update(context));
notificationRouter.delete("/:id", (context) => notificationController.delete(context));
notificationRouter.get("/send", (context) => notificationController.sendNotification(context));

export default notificationRouter;
