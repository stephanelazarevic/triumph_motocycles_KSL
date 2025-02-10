import { exhaustive } from "npm:exhaustive";
import { Context } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import { NotificationRepository } from "../../../../application/repositories/NotificationRepository.ts";
import { UserRepository } from "../../../../application/repositories/UserRepository.ts";
import { PartRepository } from "../../../../application/repositories/PartRepository.ts";
import { MaintenanceRepository } from "../../../../application/repositories/MaintenanceRepository.ts";
import { ClientRepository } from "../../../../application/repositories/ClientRepository.ts";
import { EnterpriseRepository } from "../../../../application/repositories/EnterpriseRepository.ts";
import { EmailService } from "../../../../application/services/EmailService.ts";
import { addNotificationRequestSchema, updateNotificationRequestSchema } from "../schemas/notificationRequestSchema.ts";
import { AddNotificationUsecase } from "../../../../application/usecases/notification/AddNotificationUsecase.ts";
import { GetNotificationUsecase } from "../../../../application/usecases/notification/GetNotificationUsecase.ts";
import { ListNotificationsUsecase } from "../../../../application/usecases/notification/ListNotificationsUsecase.ts";
import { UpdateNotificationUsecase } from "../../../../application/usecases/notification/UpdateNotificationUsecase.ts";
import { DeleteNotificationUsecase } from "../../../../application/usecases/notification/DeleteNotificationUsecase.ts";
import { SendNotificationUsecase } from "../../../../application/usecases/notification/SendNotificationUsecase.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";

export class NotificationController implements EntityControllerInterface{
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly partRepository: PartRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly emailService: EmailService
  ) {}

  public async getAll(context: Context): Promise<Response> {
    const listNotificationsUsecase = new ListNotificationsUsecase(this.notificationRepository);
    const result = await listNotificationsUsecase.execute();
    return context.json(JSON.stringify(result), 200);
  }

  public async getById(context: Context) {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Notification ID is required" }, 400);
    }

    const getNotificationUsecase = new GetNotificationUsecase(this.notificationRepository);
    const result = await getNotificationUsecase.execute(id);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      NotificationNotFoundError: () => context.json({ message: "Notification not found" }, 404),
    });
  }

  public async create(context: Context): Promise<Response> {
    const body = await context.req.json();
    const validation = addNotificationRequestSchema.safeParse(body);

    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const addNotificationUsecase = new AddNotificationUsecase(
      this.notificationRepository,
      this.userRepository
    );
    const result = await addNotificationUsecase.execute(validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 201);
    }

    return exhaustive({
      UserNotFoundError: () => context.json({ message: "User not found" }, 404),
    });
  }

  public async update(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Notification ID is required" }, 400);
    }

    const body = await context.req.json();
    const validation = updateNotificationRequestSchema.safeParse(body);
    if (!validation.success) {
      return context.json({ message: "Malformed request" }, 400);
    }

    const updateNotificationUsecase = new UpdateNotificationUsecase(
      this.notificationRepository,
      this.userRepository
    );
    const result = await updateNotificationUsecase.execute(id, validation.data);

    if (result) {
      return context.json(JSON.stringify(result), 200);
    }

    return exhaustive({
      NotificationNotFoundError: () => context.json({ message: "Notification not found" }, 404),
    });
  }

  public async delete(context: Context): Promise<Response> {
    const id = context.req.param("id");
    if (!id) {
      return context.json({ message: "Notification ID is required" }, 400);
    }

    const deleteNotificationUsecase = new DeleteNotificationUsecase(this.notificationRepository);
    const result = await deleteNotificationUsecase.execute(id);

    if (!result) {
      return context.json(null, 204);
    }

    return exhaustive("NotificationNotFoundError", {
      NotificationNotFoundError: () => context.json({ message: "Notification not found" }, 404),
    });
  }

  public async sendNotification(context: Context) {
    const sendNotificationUsecase = new SendNotificationUsecase(
      this.maintenanceRepository,
      this.partRepository,
      this.userRepository,
      this.clientRepository,
      this.enterpriseRepository,
      this.notificationRepository,
      this.emailService
    );
    
    try {
      await sendNotificationUsecase.execute();
      return context.json({ message: "Notifications processed successfully" }, 200);
    } catch (error) {
      console.error("❌ Error processing notifications:", error);
      return context.json({ message: "Failed to process notifications" }, 500);
    }
  }
}