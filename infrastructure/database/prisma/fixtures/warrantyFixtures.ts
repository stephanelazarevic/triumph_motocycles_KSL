import { prisma } from "../seed.ts";

export const loadWarrantyFixtures = async(motorcycleId: string) => {
  const warranty = await prisma.warranty.create({
    data: {
      idMotorcycle: motorcycleId,
      type: "Standard",
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      terms: "Standard warranty terms",
    },
  });

  return {
    warrantyId: warranty.id
  }
}