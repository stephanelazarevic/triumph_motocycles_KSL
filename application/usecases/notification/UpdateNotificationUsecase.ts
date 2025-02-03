import { NotificationRepository } from "../../repositories/NotificationRepository.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { UpdateNotificationCommand } from "../../../domain/types/NotificationType.ts";

export class UpdateNotificationUsecase {
 constructor(
   private notificationRepository: NotificationRepository,
   private userRepository: UserRepository
 ) {}

 public async execute(notificationId: string, command: UpdateNotificationCommand): Promise<NotificationEntity | Error> {
   const notification = await this.notificationRepository.findOneById(notificationId);
   if (notification instanceof Error) {
     return notification;
   }

   if (command.userId) {
     const user = await this.userRepository.findOneById(command.userId);
     if (user instanceof Error) {
       return user;
     }
     notification.user = user;
   }

   if (command.type) {
     notification.type = command.type;
   }
   if (command.message) {
     notification.message = command.message;
   }
   if (command.date) {
     notification.date = command.date;
   }
   if (command.status) {
     notification.status = command.status;
   }

   notification.markAsUpdated();
   await this.notificationRepository.save(notification);
   return notification;
 }
}
