import { prisma } from "../seed.ts";

export const loadDriverFixtures = async(
  enterpriseId: string,
  motorcycleId: string
) => {
  const driver = await prisma.driver.create({
    data: {
      firstname: "John",
      lastname: "Doe",
      licenseNumber: "LICENSE123",
      emailAddress: "driver@example.com",
      phoneNumber: {
        countryCode: "FR",
        nationalNumber: "600000000"
      },
      enterpriseId: enterpriseId,
      motorcycleId: motorcycleId,
    },
  });

  return {
    driverId: driver.id,
  }
}