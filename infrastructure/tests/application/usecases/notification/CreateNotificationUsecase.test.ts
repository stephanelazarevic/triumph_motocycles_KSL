import { expect } from "jsr:@std/expect";
import { AddNotificationUsecase } from "../../../../../application/usecases/notification/AddNotificationUsecase.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { UserRepositoryInMemory } from "../../../../adapters/repositories/UserRepositoryInMemory.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { userJohnDoe } from "../../../fixtures/UserFixtures.ts"
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { UserNotFoundError } from "../../../../../domain/errors/UserNotFoundError.ts";
import { NotificationInvalidTypeError } from "../../../../../domain/errors/NotificationInvalidTypeError.ts";
import { EmptyMessageError } from "../../../../../domain/errors/EmptyMessageError.ts";
import { NotificationInvalidStatusError } from "../../../../../domain/errors/NotificationInvalidStatusError.ts";

const notificationRepository = new NotificationRepositoryInMemory([]);

const date = new Date(2025, 1, 1);

if (date instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const type = NotificationType.ALERTE;
const message = "Notification message";
const status = NotificationStatus.UNREAD;

const userRepository = new UserRepositoryInMemory([userJohnDoe]);

Deno.test("Should return an error if the user does not exist", async () => {
    const addNotificationUsecase = new AddNotificationUsecase(
      notificationRepository,
      userRepository
    );
    const result = await addNotificationUsecase.execute({
      userId: "",
      type,
      message,
      date,
      status
    });

    expect(result).toBeInstanceOf(UserNotFoundError);
});

Deno.test("Should return an error if the type is invalid", async () => {
    const addNotificationUsecase = new AddNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const invalidNotificationType = "INVALID_TYPE" as unknown as NotificationType;
  const result = await addNotificationUsecase.execute({
    userId: userJohnDoe.id,
    type: invalidNotificationType,
    message,
    date,
    status
  });

  expect(result).toBeInstanceOf(NotificationInvalidTypeError);
});

Deno.test("Should return an error if the message is empty", async () => {
    const addNotificationUsecase = new AddNotificationUsecase(
      notificationRepository,
      userRepository
    );
    const result = await addNotificationUsecase.execute({
      userId: userJohnDoe.id,
      type,
      message: "",
      date,
      status
    });

    expect(result).toBeInstanceOf(EmptyMessageError);
  }
);

Deno.test("Should return an error if the date is invalid", async () => {
  const addNotificationUsecase = new AddNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const badReportDate = new Date(2005, 1, 1);
  const result = await addNotificationUsecase.execute({
    userId: userJohnDoe.id,
    type,
    message,
    date: badReportDate,
    status
  });

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the status is invalid", async () => {
  const addNotificationUsecase = new AddNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const invalidNotificationStatus = "INVALID_STATUS" as unknown as NotificationStatus;
  const result = await addNotificationUsecase.execute({
    userId: userJohnDoe.id,
    type,
    message,
    date,
    status: invalidNotificationStatus
  });

  expect(result).toBeInstanceOf(NotificationInvalidStatusError);
});

Deno.test("Should succeed when creating a notification correctly", async () => {
  const addNotificationUsecase = new AddNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const result = await addNotificationUsecase.execute({
    userId: userJohnDoe.id,
    type,
    message,
    date,
    status
  });

  const notifications = await notificationRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(notifications.length).toStrictEqual(1);
  expect(notifications[0].user).toStrictEqual(userJohnDoe);
  expect(notifications[0].type).toStrictEqual(type);
  expect(notifications[0].message).toStrictEqual(message);
  expect(notifications[0].date).toStrictEqual(date);
  expect(notifications[0].status).toStrictEqual(status);
});
