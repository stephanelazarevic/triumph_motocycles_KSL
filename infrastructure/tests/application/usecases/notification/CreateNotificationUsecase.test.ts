import { expect } from "jsr:@std/expect";
import { CreateNotificationUsecase } from "../../../../../application/usecases/notification/CreateNotificationUsecase.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { UserRepositoryInMemory } from "../../../../adapters/repositories/UserRepositoryInMemory.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { UserEntity } from "../../../../../domain/entities/UserEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { UserNotFoundError } from "../../../../../domain/errors/UserNotFoundError.ts";
import { NotificationInvalidTypeError } from "../../../../../domain/errors/NotificationInvalidTypeError.ts";
import { EmptyMessageError } from "../../../../../domain/errors/EmptyMessageError.ts";
import { NotificationInvalidStatusError } from "../../../../../domain/errors/NotificationInvalidStatusError.ts";
    
const notificationRepository = new NotificationRepositoryInMemory([]);

const user = UserEntity.create("Pierre", "Robin", "pierre.robin@gmail.com", "123456", "0624252627", "street1", "75010", "19", true);
  
if(user instanceof Error) {
    throw new Error("Invalid user entity");
}

const date = new Date(2025, 1, 1);

if (date instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const type = NotificationType.ALERTE;
const message = "Notification message";
const status = NotificationStatus.UNREAD;

const userRepository = new UserRepositoryInMemory([user]);

Deno.test("Should return an error if the user does not exist", async () => {
    const createNotificationUsecase = new CreateNotificationUsecase(
        notificationRepository,
        userRepository
    );
    const result = await createNotificationUsecase.execute(
        "",
        type,
        message,
        date,
        status
    );
  
    expect(result).toBeInstanceOf(UserNotFoundError);
});

Deno.test("Should return an error if the type is invalid", async () => {
    const createNotificationUsecase = new CreateNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const invalidNotificationType = "INVALID_TYPE" as unknown as NotificationType;
  const result = await createNotificationUsecase.execute(
    user.id,
    invalidNotificationType,
    message,
    date,
    status
  );

  expect(result).toBeInstanceOf(NotificationInvalidTypeError);
});

Deno.test("Should return an error if the message is empty", async () => {
    const createNotificationUsecase = new CreateNotificationUsecase(
      notificationRepository,
      userRepository
    );
    const result = await createNotificationUsecase.execute(
        user.id,
        type,
        "",
        date,
        status
    );

    expect(result).toBeInstanceOf(EmptyMessageError);
  }
);

Deno.test("Should return an error if the date is invalid", async () => {
  const createNotificationUsecase = new CreateNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const badReportDate = new Date(2005, 1, 1);
  const result = await createNotificationUsecase.execute(
    user.id,
    type,
    message,
    badReportDate,
    status
  );

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the status is invalid", async () => {
  const createNotificationUsecase = new CreateNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const invalidNotificationStatus = "INVALID_STATUS" as unknown as NotificationStatus;
  const result = await createNotificationUsecase.execute(
    user.id,
    type,
    message,
    date,
    invalidNotificationStatus
  );

  expect(result).toBeInstanceOf(NotificationInvalidStatusError);
});

Deno.test("Should succeed when creating a notification correctly", async () => {
  const createNotificationUsecase = new CreateNotificationUsecase(
    notificationRepository,
    userRepository
  );
  const result = await createNotificationUsecase.execute(
    user.id,
    type,
    message,
    date,
    status
  );

  const notifications = await notificationRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(notifications.length).toStrictEqual(1);
  expect(notifications[0].user).toStrictEqual(user);
  expect(notifications[0].type).toStrictEqual(type);
  expect(notifications[0].message).toStrictEqual(message);
  expect(notifications[0].date).toStrictEqual(date);
  expect(notifications[0].status).toStrictEqual(status);
});
