import { prisma } from "../seed.ts";

export const loadDriverFixtures = async(
  enterpriseId: string,
  motorcycleId: string
) => {
  const driver = await prisma.driver.create({
    data: {
      firstname: "Thomas",
      lastname: "Dupont",
      licenseNumber: "FR789456123",
      emailAddress: "t.dupont@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "612345678"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Marie",
      lastname: "Laurent",
      licenseNumber: "FR456789123",
      emailAddress: "m.laurent@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "623456789"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Lucas",
      lastname: "Martin",
      licenseNumber: "FR123789456",
      emailAddress: "l.martin@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "634567890"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Sophie",
      lastname: "Bernard",
      licenseNumber: "FR987654321",
      emailAddress: "s.bernard@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "645678901"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Alexandre",
      lastname: "Petit",
      licenseNumber: "FR654321987",
      emailAddress: "a.petit@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "656789012"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Julie",
      lastname: "Moreau",
      licenseNumber: "FR321987654",
      emailAddress: "j.moreau@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "667890123"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Nicolas",
      lastname: "Dubois",
      licenseNumber: "FR147258369",
      emailAddress: "n.dubois@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "678901234"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Emma",
      lastname: "Richard",
      licenseNumber: "FR258369147",
      emailAddress: "e.richard@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "689012345"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  await prisma.driver.create({
    data: {
      firstname: "Pierre",
      lastname: "Simon",
      licenseNumber: "FR369147258",
      emailAddress: "p.simon@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "690123456"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

   await prisma.driver.create({
    data: {
      firstname: "Camille",
      lastname: "Leroy",
      licenseNumber: "FR741852963",
      emailAddress: "c.leroy@enterprise.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "601234567"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  return {
    driverId: driver.id,
  }
}