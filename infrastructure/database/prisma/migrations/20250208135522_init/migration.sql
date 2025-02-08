-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('info', 'alerte', 'erreur');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('read', 'unread');

-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('restaurant', 'coursier', 'divertissement');

-- CreateEnum
CREATE TYPE "MotorcycleStatus" AS ENUM ('available', 'rented', 'in_maintenance');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('awaiting', 'confirmed', 'canceled');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('repaired', 'replaced');

-- CreateEnum
CREATE TYPE "WarrantyStatus" AS ENUM ('in_progress', 'done', 'canceled');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('panne', 'accident');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('pending', 'resolved', 'in_progress');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" JSONB NOT NULL,
    "isAdministrator" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealers" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprises" (
    "id" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "industryType" "IndustryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enterprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "idDealer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_rides" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "idMotorcycle" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT,
    "isCompleted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rentals" (
    "id" TEXT NOT NULL,
    "idClient" TEXT NOT NULL,
    "idMotorcycle" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rentals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycles" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "dealerId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "status" "MotorcycleStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycle_parts" (
    "idMotorcycle" TEXT NOT NULL,
    "idPart" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycle_parts_pkey" PRIMARY KEY ("idMotorcycle","idPart")
);

-- CreateTable
CREATE TABLE "parts" (
    "id" TEXT NOT NULL,
    "idDealer" TEXT NOT NULL,
    "idOrder" TEXT,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "parts" JSONB NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranty_parts" (
    "idPart" TEXT NOT NULL,
    "idWarranty" TEXT NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "status" "WarrantyStatus" NOT NULL,
    "coveredCost" DOUBLE PRECISION NOT NULL,
    "remainingCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_parts_pkey" PRIMARY KEY ("idPart","idWarranty")
);

-- CreateTable
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL,
    "idMotorcycle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "terms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancies" (
    "id" TEXT NOT NULL,
    "idMotorcycle" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "idMotorcycle" TEXT NOT NULL,
    "type" "IncidentType" NOT NULL,
    "description" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "resolutionDate" TIMESTAMP(3),
    "status" "IncidentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "idEnterprise" TEXT NOT NULL,
    "idMotorcycle" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_emailAddress_key" ON "users"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycles_registrationNumber_key" ON "motorcycles"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_emailAddress_key" ON "drivers"("emailAddress");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealers" ADD CONSTRAINT "dealers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprises" ADD CONSTRAINT "enterprises_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_idDealer_fkey" FOREIGN KEY ("idDealer") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_rides" ADD CONSTRAINT "test_rides_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_rides" ADD CONSTRAINT "test_rides_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorcycle_parts" ADD CONSTRAINT "motorcycle_parts_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorcycle_parts" ADD CONSTRAINT "motorcycle_parts_idPart_fkey" FOREIGN KEY ("idPart") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_idOrder_fkey" FOREIGN KEY ("idOrder") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_idDealer_fkey" FOREIGN KEY ("idDealer") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_parts" ADD CONSTRAINT "warranty_parts_idPart_fkey" FOREIGN KEY ("idPart") REFERENCES "parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_parts" ADD CONSTRAINT "warranty_parts_idWarranty_fkey" FOREIGN KEY ("idWarranty") REFERENCES "warranties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancies" ADD CONSTRAINT "maintenancies_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_idEnterprise_fkey" FOREIGN KEY ("idEnterprise") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_idMotorcycle_fkey" FOREIGN KEY ("idMotorcycle") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
