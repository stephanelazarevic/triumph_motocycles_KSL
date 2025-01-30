import { expect } from "jsr:@std/expect";
import { UserEntity } from "../../../../domain/entities/UserEntity.ts";
import { NotificationEntity } from "../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../domain/enum/NotificationEnum.ts";

Deno.test("Shoud return a notification entity", () => {
  const user = UserEntity.create("Pierre", "Robin", "pierre.robin@gmail.com", "123456", "0624252627", "street1", "75010", "19", true);
  
  if(user instanceof Error) {
    throw new Error("Invalid user entity");
  }

  const type = NotificationType.ALERTE;
  const message = "Notification message";
  const date = new Date(2025, 1, 1);
  const status = NotificationStatus.UNREAD;

  const result = NotificationEntity.create(user, type, message, date, status);

  expect(result.user).toStrictEqual(user);
  expect(result.type).toStrictEqual("alerte");
  expect(result.message).toStrictEqual("Notification message");
  expect(result.date.toISOString()).toStrictEqual(
    new Date(2025, 1, 1).toISOString()
  );
  expect(result.status).toStrictEqual("unread");
});

Deno.test("Should throw error for invalid notification entity data", () => {
  const user = UserEntity.create("Pierre", "Robin", "pierre.robin@gmail.com", "123456", "0624252627", "street1", "75010", "19", true);

  if(user instanceof Error) {
    throw new Error("Invalid user entity");
  }

  const type = NotificationType.ALERTE;
  const message = "";
  const date = new Date(2020, 1, 1);
  const status = NotificationStatus.UNREAD;

  expect(() => {
    NotificationEntity.create(user, type, message, date as never, status);
  }).toThrow();
});
