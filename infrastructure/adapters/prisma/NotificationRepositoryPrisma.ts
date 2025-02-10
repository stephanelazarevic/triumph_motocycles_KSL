import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { NotificationRepository } from "../../../application/repositories/NotificationRepository.ts";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity.ts";
import { mapNotificationStatusToPrismaNotificationStatus, mapNotificationTypeToPrismaNotificationType } from "./mappers/NotificationMapper.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { NotificationNotFoundError } from "../../../domain/errors/NotificationNotFoundError.ts";

export class NotificationRepositoryPrisma implements NotificationRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(notification: NotificationEntity): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: notification.id,
        user: notification.user,
        type: mapNotificationTypeToPrismaNotificationType(notification.type),
        message: notification.message,
        date: notification.date,
        status: mapNotificationStatusToPrismaNotificationStatus(notification.status),
      }
    });
  }

  public async findAll(): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany();

    return notifications.map(notification =>
        NotificationEntity.reconstitute({
            id: notification.id,
            user: notification.user.map(user =>
                UserEntity.reconstitute({
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    hashedPassword: user.hashedPassword,
                    emailAddress: user.emailAddress,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    isAdministrator: user.isAdministrator,
                    token: user.token
                })),
            type: notification.type,
            message: notification.message,
            date: notification.date,
            status: notification.status
        })
    );
  }

  public async findOneById(id: string): Promise<NotificationEntity | NotificationNotFoundError> {
    const notification = await this.prisma.notification.findUnique(
        { where: { id } }
    );

    if (!notification) {
      return new NotificationNotFoundError();
    }

    return NotificationEntity.reconstitute({
        id: notification.id,
        user: notification.user.map(user =>
            UserEntity.reconstitute({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                hashedPassword: user.hashedPassword,
                emailAddress: user.emailAddress,
                phoneNumber: user.phoneNumber,
                address: user.address,
                isAdministrator: user.isAdministrator,
                token: user.token
            })),
        type: notification.type,
        message: notification.message,
        date: notification.date,
        status: notification.status
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id }
    });
  }

  public async findRecentNotification(userId: string, type: string): Promise<NotificationEntity | NotificationNotFoundError> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const notification = await this.prisma.notification.findFirst({
      where: {
        userId,
        type,
        date: { gte: oneWeekAgo }
      },
      orderBy: {
        date: "desc"
      }
    });

    return notification ? NotificationEntity.reconstitute({
      id: notification.id,
      user: notification.user,
      type: notification.type,
      message: notification.message,
      date: notification.date,
      status: notification.status
    }) : new NotificationNotFoundError();
  }

  public async findNotificationsByStatus(status: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { status }
    });
    return notifications.map(notification =>
      NotificationEntity.reconstitute({
        id: notification.id,
        user: notification.user,
        type: notification.type,
        message: notification.message,
        date: notification.date,
        status: notification.status
      })
    );
  }
}
