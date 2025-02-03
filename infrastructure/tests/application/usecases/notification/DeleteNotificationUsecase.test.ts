import { expect } from "jsr:@std/expect";
import { DeleteNotificationUsecase } from "../../../../../application/usecases/notification/DeleteNotificationUsecase.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { NotificationEntity } from "../../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { NotificationNotFoundError } from "../../../../../domain/errors/NotificationNotFoundError.ts";
import { userJohnDoe } from "../../../fixtures/UserFixtures.ts";

Deno.test("Should delete a notification successfully when it exists", async () => {
  const notification = NotificationEntity.create({
    user: userJohnDoe,
    type: NotificationType.ALERTE,
    message: "message",
    date: new Date(2025, 1, 1),
    status: NotificationStatus.READ,
  });

  const notificationRepository = new NotificationRepositoryInMemory([notification]);
  const deleteNotificationUsecase = new DeleteNotificationUsecase(notificationRepository);

  const result = await deleteNotificationUsecase.execute(notification.id);

  const notifications = await notificationRepository.findAll();

  expect(result).toBeUndefined();
  expect(notifications.length).toStrictEqual(0);
});

Deno.test("Should return an error when the notification does not exist", async () => {
  const notificationRepository = new NotificationRepositoryInMemory([]);
  const deleteNotificationUsecase = new DeleteNotificationUsecase(notificationRepository);

  const badId = "badId";
  const result = await deleteNotificationUsecase.execute(badId);

  expect(result).toBeInstanceOf(NotificationNotFoundError);
});
