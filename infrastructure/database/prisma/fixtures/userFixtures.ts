import { prisma } from "../seed.ts";
import bcrypt from "npm:bcryptjs";

export const loadUserFixtures = async() => {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hashSync("admin123", salt);

  await prisma.user.create({
    data: {
      firstname: "Admin",
      lastname: "TOTO",
      hashedPassword: adminPassword,
      emailAddress: "admin@example.com",
      phoneNumber: {
        countryCode: "+33",
        nationalNumber: "600000000"
      },
      address: {
        street: "1st street",
        postalCode: "75017",
        countryCode: "FR"
      },
      isAdministrator: true,
    },
  });

  const dealer = await prisma.user.create({
    data: {
      firstname: "Dealer",
      lastname: "One",
      hashedPassword: bcrypt.hashSync("dealer123", salt),
      emailAddress: "dealer@example.com",
      phoneNumber: {
        countryCode: "+33",
        nationalNumber: "600000000"
      },
      address: {
        street: "1st street",
        postalCode: "75017",
        countryCode: "FR"
      },
      isAdministrator: false,
      dealer: {
        create: {
          site: "Paris",
        },
      },
    },
  });

  const enterprise = await prisma.user.create({
    data: {
      firstname: "Enterprise",
      lastname: "One",
      hashedPassword: bcrypt.hashSync("enterprise123", salt),
      emailAddress: "enterprise@example.com",
      phoneNumber: {
        countryCode: "+33",
        nationalNumber: "600000000"
      },
      address: {
        street: "1st street",
        postalCode: "75017",
        countryCode: "FR"
      },
      isAdministrator: false,
      enterprise: {
        create: {
          taxNumber: "123456789",
          industryType: "restaurant",
        },
      },
    },
  });

  const client = await prisma.user.create({
    data: {
      firstname: "Client",
      lastname: "One",
      hashedPassword: bcrypt.hashSync("client123", salt),
      emailAddress: "client@example.com",
      phoneNumber: {
        countryCode: "+33",
        nationalNumber: "600000000"
      },
      address: {
        street: "1st street",
        postalCode: "75017",
        countryCode: "FR"
      },
      isAdministrator: false,
      client: {
        create: {
          idDealer: dealer.id,
        },
      },
    },
  });

  return {
    dealerId: dealer.id,
    enterpriseId: enterprise.id,
    clientId: client.id
  }
}