import { expect } from "jsr:@std/expect";
import { FindNotificationUsecase } from "../../../../../application/usecases/notification/FindNotificationUsecase.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { NotificationEntity } from "../../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { NotificationNotFoundError } from "../../../../../domain/errors/NotificationNotFoundError.ts";
import { userJohnDoe } from "../../../fixtures/UserFixtures.ts";

Deno.test("Should find a notification successfully when it exists", async () => {
  const date = new Date(2025, 1, 1);

  if (date instanceof Error) {
    throw new InvalidDateError("Invalid date");
  }

  const type = NotificationType.ALERTE;
  const message = "Notification message";
  const status = NotificationStatus.UNREAD;

  const notification = NotificationEntity.create({
    user: userJohnDoe,
    type,
    message,
    date,
    status
  });

  const notificationRepository = new NotificationRepositoryInMemory([notification]);
  const findNotificationUsecase = new FindNotificationUsecase(notificationRepository);

  const result = await findNotificationUsecase.execute(notification.id);

  expect(result).not.toBeInstanceOf(NotificationNotFoundError);
  expect(result).toStrictEqual(notification);
});

Deno.test("Should return an error when the notification does not exist", async () => {
  const notificationRepository = new NotificationRepositoryInMemory([]);
  const findNotificationUsecase = new FindNotificationUsecase(notificationRepository);

  const badId = "badId";
  const result = await findNotificationUsecase.execute(badId);

  expect(result).toBeInstanceOf(NotificationNotFoundError);
});
