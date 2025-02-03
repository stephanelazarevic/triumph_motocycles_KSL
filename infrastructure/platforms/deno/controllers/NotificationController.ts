import type { NotificationRepository } from "../../../../application/repositories/NotificationRepository.ts";
import { AddNotificationUsecase } from "../../../../application/usecases/notification/AddNotificationUsecase.ts";
import { GetNotificationUsecase } from "../../../../application/usecases/notification/GetNotificationUsecase.ts";
import { ListNotificationsUsecase } from "../../../../application/usecases/notification/ListNotificationsUsecase.ts";
import { UpdateNotificationUsecase } from "../../../../application/usecases/notification/UpdateNotificationUsecase.ts";
import { DeleteNotificationUsecase } from "../../../../application/usecases/notification/DeleteNotificationUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { addNotificationRequestSchema, updateNotificationRequestSchema } from "../schemas/notificationRequestSchema.ts";
import { UserRepository } from "../../../../application/repositories/UserRepository.ts";
import { EntityControllerInterface } from "./EntityControllerInterface.ts";
import { NotificationEntity } from "../../../../domain/entities/NotificationEntity.ts";

export class NotificationController implements EntityControllerInterface{
  public constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async getAll(): Promise<Response> {
    const listNotificationsUsecase = new ListNotificationsUsecase(this.notificationRepository);

    const result = await listNotificationsUsecase.execute();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getById(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Notification ID is required", { status: 400 });
    }

    const getNotificationUsecase = new GetNotificationUsecase(this.notificationRepository);

    const result = await getNotificationUsecase.execute(id);

    if (result instanceof NotificationEntity) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return exhaustive(result.name, {
      NotificationNotFoundError: () =>
        new Response("NotificationNotFoundError", { status: 404 }),
    });
  }

  public async create(request: Request): Promise<Response> {
    const addNotificationUsecase = new AddNotificationUsecase(
      this.notificationRepository,
      this.userRepository
    );

    const body = await request.json();

    const validation = addNotificationRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { userId, type, message, date, status } = validation.data;

    const result = await addNotificationUsecase.execute({
      userId,
      type,
      message,
      date,
      status
    });

    if (result instanceof NotificationEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      UserNotFoundError: () =>
        new Response("UserNotFoundError", { status: 404 }),
    });
  }

  public async update(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const notificationId = url.searchParams.get("id");

    if (!notificationId) {
      return new Response("Notification ID is required", { status: 400 });
    }

    const body = await request.json();
    const validation = updateNotificationRequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response("Malformed request", { status: 400 });
    }

    const updateNotificationUsecase = new UpdateNotificationUsecase(this.notificationRepository, this.userRepository);
    const result = await updateNotificationUsecase.execute(notificationId, validation.data);

    if (result instanceof NotificationEntity) {
      return new Response(null, { status: 201 });
    }

    return exhaustive(result.name, {
      NotificationNotFoundError: () =>
        new Response("NotificationNotFoundError", { status: 404 }),
    });
  }

  public async delete(request: Request): Promise<Response> {
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
