import type { NotificationRepository } from "../../../../application/repositories/NotificationRepository.ts";
import { CreateNotificationUsecase } from "../../../../application/usecases/notification/CreateNotificationUsecase.ts";
import { FindNotificationUsecase } from "../../../../application/usecases/notification/FindNotificationUsecase.ts";
import { FindAllNotificationsUsecase } from "../../../../application/usecases/notification/FindAllNotificationsUsecase.ts";
import { UpdateNotificationUsecase } from "../../../../application/usecases/notification/UpdateNotificationUsecase.ts";
import { DeleteNotificationUsecase } from "../../../../application/usecases/notification/DeleteNotificationUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createNotificationRequestSchema } from "../schemas/createNotificationRequestSchema.ts";
import { UserRepository } from "../../../../application/repositories/UserRepository.ts";
import { NotificationNotFoundError } from "../../../../domain/errors/NotificationNotFoundError.ts";

export class NotificationController {
  public constructor(
    private readonly notificationRepository: NotificationRepository, 
    private readonly userRepository: UserRepository
  ) {}

  public async getAllNotifications(): Promise<Response> {
    const listNotificationsUsecase = new FindAllNotificationsUsecase(this.notificationRepository);

    const result = await listNotificationsUsecase.execute();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getNotificationById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Notification ID is required", { status: 400 });
    }

    const findNotificationUsecase = new FindNotificationUsecase(this.notificationRepository);

    const result = await findNotificationUsecase.execute(id);

    if (result instanceof NotificationNotFoundError) {
      return new Response("NotificationNotFoundError", { status: 404 });
    }

    if (typeof result === "object" && result !== null) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive({
      NotificationNotFoundError: () =>
        new Response("NotificationNotFoundError", { status: 404 }),
    });
  }

  public async createNotification(request: Request): Promise<Response> {
    const createNotificationUsecase = new CreateNotificationUsecase(
      this.notificationRepository,
      this.userRepository
    );

    const body = await request.json();

    const validation = createNotificationRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { userId, type, message, date, status } = validation.data;

    const error = await createNotificationUsecase.execute(
      userId,
      type,
      message,
      date,
      status
    );

    if (!error) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(error.name, {
      UserNotFoundError: () =>
        new Response("UserNotFoundError", { status: 404 }),
    });
  }

  public async updateNotification(request: Request): Promise<Response> {
    const updateNotificationUsecase = new UpdateNotificationUsecase(this.notificationRepository);

    const body = await request.json();

    const validation = createNotificationRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const result = await updateNotificationUsecase.execute(validation.data);

    if (result === undefined) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      NotificationNotFoundError: () =>
        new Response("NotificationNotFoundError", { status: 404 }),
    });
  }

  public async deleteNotification(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Notification ID is required", { status: 400 });
    }

    const deleteNotificationUsecase = new DeleteNotificationUsecase(
      this.notificationRepository
    );

    const result = await deleteNotificationUsecase.execute(id);

    if (result === undefined) {
      return new Response(null, { status: 204 });
    }

    return exhaustive(result.name, {
      NotificationNotFoundError: () =>
        new Response("NotificationNotFoundError", { status: 404 }),
    });
  }
}
