import { expect } from "jsr:@std/expect";
import { UpdateNotificationUsecase } from "../../../../../application/usecases/notification/UpdateNotificationUsecase.ts";
import { NotificationEntity } from "../../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { NotificationNotFoundError } from "../../../../../domain/errors/NotificationNotFoundError.ts";
import { userJohnDoe } from "../../../fixtures/UserFixtures.ts";

Deno.test("Should update a notification successfully when it exists", async () => {
  const existingNotification = NotificationEntity.create({
    user: userJohnDoe,
    type: NotificationType.ALERTE,
    message: "Notification message",
    date: new Date(2025, 1, 1),
    status: NotificationStatus.UNREAD
  });

  const notificationRepository = new NotificationRepositoryInMemory([existingNotification]);
  const updateNotificationUsecase = new UpdateNotificationUsecase(notificationRepository);

  const updatedNotification = { ...existingNotification, message: "Message mise à jour" };

  const result = await updateNotificationUsecase.execute(existingNotification.id, updatedNotification);

  const notifications = await notificationRepository.findAll();

  expect(result).toBeUndefined();
  expect(notifications.length).toStrictEqual(1);
  expect(notifications[0].message).toStrictEqual("Message mise à jour");
});

Deno.test("Should return an error when the notification does not exist", async () => {
  const notificationRepository = new NotificationRepositoryInMemory([]);
  const updateNotificationUsecase = new UpdateNotificationUsecase(notificationRepository);

  const nonExistentNotification = NotificationEntity.create({
    user: userJohnDoe,
    type: NotificationType.ERREUR,
    message: "Notification message",
    date: new Date(2023, 1, 1),
    status: NotificationStatus.READ
  });

  const result = await updateNotificationUsecase.execute("blabla", nonExistentNotification);

  expect(result).toBeInstanceOf(NotificationNotFoundError);
});
