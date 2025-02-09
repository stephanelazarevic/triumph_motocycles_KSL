import { prisma } from "../seed.ts";

export const loadNotificationFixtures = async(clientId: string) => {
  await prisma.notification.create({
    data: {
      idUser: clientId,
      type: "info",
      message: "Welcome to our platform!",
      date: new Date(),
      status: "unread",
    },
  });
}