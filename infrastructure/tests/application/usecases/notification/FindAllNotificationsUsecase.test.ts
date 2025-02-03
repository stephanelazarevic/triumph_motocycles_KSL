import { expect } from "jsr:@std/expect";
import { FindAllNotificationsUsecase } from "../../../../../application/usecases/notification/FindAllNotificationsUsecase.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { NotificationEntity } from "../../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { userJohnDoe } from "../../../fixtures/UserFixtures.ts";

const date = new Date(2025, 1, 1);

if (date instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const type = NotificationType.ALERTE;
const message = "Notification message";
const status = NotificationStatus.UNREAD;

Deno.test("Should return all notifications", async () => {
  const notification = NotificationEntity.create({
    user: userJohnDoe,
    type,
    message,
    date,
    status
  });
  const notificationRepository = new NotificationRepositoryInMemory([
    notification,
  ]);

  const findAllNotificationsUsecase = new FindAllNotificationsUsecase(
    notificationRepository
  );
  const result = await findAllNotificationsUsecase.execute();

  expect(result.length).toStrictEqual(1);

  if (result.length > 0) {
    expect(result[0].message).toStrictEqual("Notification message");
  }
});

Deno.test(
  "Should return an empty list when no notifications exist",
  async () => {
    const notificationRepository = new NotificationRepositoryInMemory([]);
    const findAllNotificationsUsecase = new FindAllNotificationsUsecase(
      notificationRepository
    );

    const result = await findAllNotificationsUsecase.execute();

    expect(result).toStrictEqual([]);
  }
);
