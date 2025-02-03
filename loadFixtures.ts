import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import process from "node:process";

const prisma = new PrismaClient();

async function loadFixtures() {
  try {
    // Clean the database
    await cleanDatabase();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hashSync("admin123", salt);
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        hashedPassword: adminPassword,
        role: "admin",
      },
    });

    // Create dealer
    const dealer = await prisma.user.create({
      data: {
        name: "Dealer One",
        email: "dealer@example.com",
        hashedPassword: bcrypt.hashSync("dealer123", salt),
        role: "user",
        dealer: {
          create: {
            location: "Paris",
          },
        },
      },
    });

    // Create enterprise
    const enterprise = await prisma.user.create({
      data: {
        name: "Enterprise One",
        email: "enterprise@example.com",
        hashedPassword: bcrypt.hashSync("enterprise123", salt),
        role: "user",
        enterprise: {
          create: {
            taxNumber: "123456789",
            industryType: "restaurant",
          },
        },
      },
    });

    // Create client
    const client = await prisma.user.create({
      data: {
        name: "Client One",
        email: "client@example.com",
        hashedPassword: bcrypt.hashSync("client123", salt),
        role: "user",
        client: {
          create: {
            idDealer: dealer.id,
          },
        },
      },
    });

    // Create motos
    const moto1 = await prisma.moto.create({
      data: {
        model: "Model X",
        registrationNumber: "ABC123",
        status: "available",
        idDealer: dealer.id,
      },
    });

    const moto2 = await prisma.moto.create({
      data: {
        model: "Model Y",
        registrationNumber: "DEF456",
        status: "available",
        idDealer: dealer.id,
      },
    });

    // Create driver
    const driver = await prisma.driver.create({
      data: {
        firstname: "John",
        lastname: "Doe",
        licenseNumber: "LICENSE123",
        email: "driver@example.com",
        phone: "+33123456789",
        idEntreprise: enterprise.id,
        idMoto: moto1.id,
      },
    });

    // Create command and parts
    const command = await prisma.command.create({
      data: {
        parts: JSON.stringify([{ name: "Part 1", quantity: 2 }]),
        orderDate: new Date(),
        status: "confirmed",
        totalAmount: 1500,
      },
    });

    const part = await prisma.part.create({
      data: {
        reference: "REF123",
        type: "Engine",
        price: 750,
        stockQuantity: 5,
        idDealer: dealer.id,
        idCommand: command.id,
      },
    });

    // Create maintenance record
    await prisma.maintenance.create({
      data: {
        idMoto: moto1.id,
        date: new Date(),
        description: "Regular maintenance",
        cost: 200,
      },
    });

    // Create warranty
    const warranty = await prisma.warranty.create({
      data: {
        idMoto: moto1.id,
        type: "Standard",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        terms: "Standard warranty terms",
      },
    });

    // Create warranty parts
    await prisma.warrantyParts.create({
      data: {
        idPart: part.id,
        idWarranty: warranty.id,
        actionDate: new Date(),
        actionType: "replaced",
        status: "done",
        coveredCost: 500,
        remainingCost: 250,
      },
    });

    // Create notifications
    await prisma.notif.create({
      data: {
        idUser: client.id,
        type: "info",
        message: "Welcome to our platform!",
        date: new Date(),
        status: "unread",
      },
    });

    console.log("Fixtures loaded successfully!");
  } catch (error) {
    console.error("Error loading fixtures:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanDatabase() {
  // Delete all records in reverse order of dependencies
  await prisma.notif.deleteMany({});
  await prisma.warrantyParts.deleteMany({});
  await prisma.warranty.deleteMany({});
  await prisma.maintenance.deleteMany({});
  await prisma.breakdown.deleteMany({});
  await prisma.motoPart.deleteMany({});
  await prisma.part.deleteMany({});
  await prisma.command.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.testRide.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.moto.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.enterprise.deleteMany({});
  await prisma.dealer.deleteMany({});
  await prisma.user.deleteMany({});
}

// Execute the function
loadFixtures()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
