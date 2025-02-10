import { loadDriverFixtures } from "./fixtures/driverFixtures.ts";
import { loadMotorcycleFixtures } from "./fixtures/motorcycleFixtures.ts";
import { loadOrderFixtures } from "./fixtures/orderFixtures.ts";
import { loadUserFixtures } from "./fixtures/userFixtures.ts";
import { loadPartFixtures } from "./fixtures/partFixtures.ts";
import { loadWarrantyFixtures } from "./fixtures/warrantyFixtures.ts";
import { PrismaClient } from "./generated/client-deno/deno/edge.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { loadMaintenanceFixtures } from "./fixtures/maintenanceFixtures.ts";
import { loadWarrantyPartFixtures } from "./fixtures/warrantyPartFixtures.ts";
import { loadNotificationFixtures } from "./fixtures/notificationFixtures.ts";
import { loadMotorcycleHistoryFixtures } from "./fixtures/motorcycleHistoryFixtures.ts";

const env = config();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
});

async function seed() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');

    await cleanDatabase();
    console.log('✅ Database cleaned successfully');

    const { dealerId, enterpriseId, clientId }  = await loadUserFixtures();
    const { motorcycle1Id, motorcycle2Id }      = await loadMotorcycleFixtures(dealerId, enterpriseId);
    const { orderId }                           = await loadOrderFixtures();
    const { partId }                            = await loadPartFixtures(dealerId, orderId);
    const { warrantyId }                        = await loadWarrantyFixtures(motorcycle1Id);

    await loadMotorcycleHistoryFixtures(motorcycle1Id, motorcycle2Id, clientId);
    await loadDriverFixtures(enterpriseId, motorcycle1Id);
    await loadMaintenanceFixtures(motorcycle1Id);
    await loadWarrantyPartFixtures(partId, warrantyId);
    await loadNotificationFixtures(clientId);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
}

seed()
  .then(() => console.log("🌱 Seeding completed !"))
  .catch((e) => console.error("❌ Error while seeding:", e))
  .finally(async () => await prisma.$disconnect());

async function cleanDatabase() {
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
  await prisma.motorcycleHistory.deleteMany({});
  await prisma.motorcycle.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.enterprise.deleteMany({});
  await prisma.dealer.deleteMany({});
  await prisma.user.deleteMany({});
}
