import { expect } from "jsr:@std/expect";
import { UserEntity } from "../../../../domain/entities/UserEntity.ts";
import { NotificationEntity } from "../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../domain/enum/NotificationEnum.ts";
import { EmailAddress } from "../../../../domain/value-objects/EmailAddress.ts";
import { Address } from "../../../../domain/value-objects/Address.ts";
import { PhoneNumber } from "../../../../domain/value-objects/PhoneNumber.ts";
import { Name } from "../../../../domain/value-objects/Name.ts";
import { userJohnDoe } from "../../fixtures/UserFixtures.ts"

Deno.test("Shoud return a notification entity", () => {
  const user = UserEntity.create({
    firstname: "Pierre" as unknown as Name,
    lastname: "Robin" as unknown as Name,
    emailAddress: "pierre.robin@gmail.com" as unknown as EmailAddress,
    hashedPassword: "poiujhgvtysd555555hj",
    phoneNumber: "0624252627" as unknown as PhoneNumber,
    address: {
      street: "street",
      postalCode: "123456",
      countryCode: 'US',
    } as Address,
  });

  if(user instanceof Error) {
    throw new Error("Invalid user entity");
  }

  const type = NotificationType.ALERTE;
  const message = "Notification message";
  const date = new Date(2025, 1, 1);
  const status = NotificationStatus.UNREAD;

  const result = NotificationEntity.create({
    user,
    type,
    message,
    date,
    status
  });

  expect(result.user).toStrictEqual(user);
  expect(result.type).toStrictEqual("alerte");
  expect(result.message).toStrictEqual("Notification message");
  expect(result.date.toISOString()).toStrictEqual(
    new Date(2025, 1, 1).toISOString()
  );
  expect(result.status).toStrictEqual("unread");
});

Deno.test("Should throw error for invalid notification entity data", () => {
  const type = NotificationType.ALERTE;
  const message = "";
  const date = new Date(2020, 1, 1);
  const status = NotificationStatus.UNREAD;

  expect(() => {
    NotificationEntity.create({
      user: userJohnDoe,
      type,
      message,
      date: date as never,
      status
    });
  }).toThrow();
});
