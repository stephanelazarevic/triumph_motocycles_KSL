import { expect } from "jsr:@std/expect";
import { UpdateNotificationUsecase } from "../../../../../application/usecases/notification/UpdateNotificationUsecase.ts";
import { NotificationEntity } from "../../../../../domain/entities/NotificationEntity.ts";
import { NotificationStatus, NotificationType } from "../../../../../domain/enum/NotificationEnum.ts";
import { NotificationRepositoryInMemory } from "../../../../adapters/repositories/NotificationRepositoryInMemory.ts";
import { UserEntity } from "../../../../../domain/entities/UserEntity.ts";
import { NotificationNotFoundError } from "../../../../../domain/errors/NotificationNotFoundError.ts";

Deno.test("Should update a notification successfully when it exists", async () => {
  const user = UserEntity.create("Pierre", "Robin", "pierre.robin@gmail.com", "123456", "0624252627", "street1", "75010", "19", true);
    
  if(user instanceof Error) {
      throw new Error("Invalid user entity");
  }

  const existingNotification = NotificationEntity.create(
    user,
    NotificationType.ALERTE,
    "Notification message",
    new Date(2025, 1, 1),
    NotificationStatus.UNREAD
  );
  
  const notificationRepository = new NotificationRepositoryInMemory([existingNotification]);
  const updateNotificationUsecase = new UpdateNotificationUsecase(notificationRepository);

  const updatedNotification = { ...existingNotification, message: "Message mise à jour" };

  const result = await updateNotificationUsecase.execute(updatedNotification);

  const notifications = await notificationRepository.findAll();

  expect(result).toBeUndefined(); 
  expect(notifications.length).toStrictEqual(1);
  expect(notifications[0].message).toStrictEqual("Message mise à jour");
});

Deno.test("Should return an error when the notification does not exist", async () => {
  const notificationRepository = new NotificationRepositoryInMemory([]);
  const updateNotificationUsecase = new UpdateNotificationUsecase(notificationRepository);

  const user = UserEntity.create("Pierre", "Robin", "pierre.robin@gmail.com", "123456", "0624252627", "street1", "75010", "19", true);
    
  if(user instanceof Error) {
      throw new Error("Invalid user entity");
  }

  const nonExistentNotification = NotificationEntity.create(
    user,
    NotificationType.ERREUR,
    "Notification message",
    new Date(2023, 1, 1),
    NotificationStatus.READ
  );

  const result = await updateNotificationUsecase.execute(nonExistentNotification);

  expect(result).toBeInstanceOf(NotificationNotFoundError);
});
