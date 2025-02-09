import { prisma } from "../seed.ts";

export const loadMaintenanceFixtures = async(motorcycleId: string) => {
  await prisma.maintenance.create({
    data: {
      idMotorcycle: motorcycleId,
      date: new Date(),
      description: "Regular maintenance",
      cost: 200,
    },
  });
}