import { prisma } from "../seed.ts";

export const loadMotorcycleFixtures = async(
  dealerId: string,
  enterpriseId: string
) => {
  const motorcycle1 = await prisma.motorcycle.create({
    data: {
      model: "Street Triple RS",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR765RS",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  const motorcycle2 = await prisma.motorcycle.create({
    data: {
      model: "Tiger 900 Rally Pro",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR900RP",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Bonneville T120",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200B",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Speed Triple 1200 RS",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200S",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Trident 660",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR660T",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Rocket 3 R",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR2500R",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Tiger 1200 GT Pro",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200GT",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Scrambler 1200 XE",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200X",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Speed Twin",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200ST",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Thruxton RS",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200TR",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Tiger Sport 660",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR660TS",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Street Twin",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR900ST",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Bonneville Bobber",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200BB",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Bonneville Speedmaster",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200SM",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Tiger 850 Sport",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR850SP",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Daytona Moto2 765",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR765DT",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Street Triple R",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR765R",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Tiger 1200 Rally Pro",
      brand: "Triumph",
      year: 2024,
      registrationNumber: "TR1200RP",
      status: "available",
      dealerId: dealerId,
      enterpriseId: enterpriseId
    },
  });

  return {
    motorcycle1Id: motorcycle1.id,
    motorcycle2Id: motorcycle2.id,
  }
}