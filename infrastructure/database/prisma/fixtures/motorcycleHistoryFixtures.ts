import { prisma } from "../seed.ts";

export const loadMotorcycleHistoryFixtures = async (
  motorcycle1Id: string,
  motorcycle2Id: string,
  clientId: string
) => {
  const history1 = await prisma.motorcycleHistory.create({
    data: {
      motorcycleId: motorcycle1Id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-01'),
      clientId: clientId,
    },
  });

  const history2 = await prisma.motorcycleHistory.create({
    data: {
      motorcycleId: motorcycle2Id,
      startDate: new Date('2024-02-02'),
      endDate: new Date('2024-03-01'),
      clientId: clientId,
    },
  });

  return {
    history1Id: history1.id,
    history2Id: history2.id
  };
};
