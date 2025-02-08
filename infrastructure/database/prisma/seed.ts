import bcrypt from "npm:bcryptjs";
import { PrismaClient } from "./generated/client-deno/deno/edge.ts";

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');

    await loadFixtures();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
}

seed()
  .then(() => console.log("🌱 Seeding completed !"))
  .catch((e) => console.error("❌ Error while seeding:", e))
  .finally(async () => await prisma.$disconnect());

async function loadFixtures() {
  // Clean the database
  await cleanDatabase();

  // Create admin user
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hashSync("admin123", salt);
  await prisma.user.create({
    data: {
      firstname: "Admin",
      lastname: "TOTO",
      hashedPassword: adminPassword,
      emailAddress: "admin@example.com",
      phoneNumber: "0600000000",
      address: {},
      isAdministrator: true,
    },
  });

  // Create dealer
  const dealer = await prisma.user.create({
    data: {
      firstname: "Dealer",
      lastname: "One",
      hashedPassword: bcrypt.hashSync("dealer123", salt),
      emailAddress: "dealer@example.com",
      phoneNumber: "0600000000",
      address: {},
      isAdministrator: false,
      dealer: {
        create: {
          site: "Paris",
        },
      },
    },
  });

  // Create enterprise
  const enterprise = await prisma.user.create({
    data: {
      firstname: "Enterprise",
      lastname: "One",
      hashedPassword: bcrypt.hashSync("enterprise123", salt),
      emailAddress: "enterprise@example.com",
      phoneNumber: "0600000000",
      address: {},
      isAdministrator: false,
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
      firstname: "Client",
      lastname: "One",
      hashedPassword: bcrypt.hashSync("client123", salt),
      emailAddress: "client@example.com",
      phoneNumber: "0600000000",
      address: {},
      isAdministrator: false,
      client: {
        create: {
          idDealer: dealer.id,
        },
      },
    },
  });

  // Create motos
  const motorcycle1 = await prisma.motorcycle.create({
    data: {
      model: "Model X",
      brand: "Brand X",
      year: 2002,
      registrationNumber: "ABC123",
      status: "available",
      dealerId: dealer.id
    },
  });

  await prisma.motorcycle.create({
    data: {
      model: "Model Y",
      brand: "Brand Y",
      year: 2003,
      registrationNumber: "DEF456",
      status: "available",
      dealerId: dealer.id
    },
  });

  // Create driver
  await prisma.driver.create({
    data: {
      firstname: "John",
      lastname: "Doe",
      licenseNumber: "LICENSE123",
      emailAddress: "driver@example.com",
      phoneNumber: "+33123456789",
      idEnterprise: enterprise.id,
      idMotorcycle: motorcycle1.id,
    },
  });

  // Create order and parts
  const order = await prisma.order.create({
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
      idOrder: order.id,
    },
  });

  // Create maintenance record
  await prisma.maintenance.create({
    data: {
      idMotorcycle: motorcycle1.id,
      date: new Date(),
      description: "Regular maintenance",
      cost: 200,
    },
  });

  // Create warranty
  const warranty = await prisma.warranty.create({
    data: {
      idMotorcycle: motorcycle1.id,
      type: "Standard",
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
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
  await prisma.notification.create({
    data: {
      idUser: client.id,
      type: "info",
      message: "Welcome to our platform!",
      date: new Date(),
      status: "unread",
    },
  });
}

async function cleanDatabase() {
  // Delete all records in reverse order of dependencies
  await prisma.notification.deleteMany({});
  await prisma.warrantyParts.deleteMany({});
  await prisma.warranty.deleteMany({});
  await prisma.maintenance.deleteMany({});
  await prisma.incident.deleteMany({});
  await prisma.motorcyclePart.deleteMany({});
  await prisma.part.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.testRide.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.motorcycle.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.enterprise.deleteMany({});
  await prisma.dealer.deleteMany({});
  await prisma.user.deleteMany({});
}
