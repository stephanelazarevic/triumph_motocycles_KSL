import { prisma } from "../seed.ts";

export const loadWarrantyPartFixtures = async(
  partId: string,
  warrantyId: string
) => {
  await prisma.warrantyParts.create({
    data: {
      idPart: partId,
      idWarranty: warrantyId,
      actionDate: new Date(),
      actionType: "replaced",
      status: "done",
      coveredCost: 500,
      remainingCost: 250,
    },
  });

}