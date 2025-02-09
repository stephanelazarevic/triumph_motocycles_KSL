import { prisma } from "../seed.ts";

export const loadMotorcycleFixtures = async(
  dealerId: string,
  enterpriseId: string
) => {

  const motorcycle1 = await prisma.motorcycle.create({
    data: {
      model: "Model X",
      brand: "Brand X",
      year: 2002,
      registrationNumber: "ABC123",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  const motorcycle2 = await prisma.motorcycle.create({
    data: {
      model: "Model Y",
      brand: "Brand Y",
      year: 2003,
      registrationNumber: "DEF456",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  return {
    motorcycle1Id: motorcycle1.id,
    motorcycle2Id: motorcycle2.id
  }
}
