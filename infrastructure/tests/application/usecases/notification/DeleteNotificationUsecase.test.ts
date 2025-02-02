import { expect } from "jsr:@std/expect";
import { DeleteNotificationUsecase } from "../../../../../application/usecases/notification/DeleteNotificationUsecase.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { NotificationEntity } from "../../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { UserEntity } from "../../../../../domain/entities/UserEntity.ts";
import { NotificationNotFoundError } from "../../../../../domain/errors/NotificationNotFoundError.ts";

Deno.test("Should delete a notification successfully when it exists", async () => {
  const user = UserEntity.create("Pierre", "Robin", "pierre.robin@gmail.com", "123456", "0624252627", "street1", "75010", "19", true);

  if(user instanceof Error) {
    throw new Error("Invalid user entity");
  }

  const notification = NotificationEntity.create(
    user,
    NotificationType.ALERTE,
    "message",
    new Date(2025, 1, 1),
    NotificationStatus.READ,
  );

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
