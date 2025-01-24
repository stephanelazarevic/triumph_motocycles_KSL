-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('info', 'alerte', 'erreur');

-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('read', 'unread');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('restaurant', 'coursier', 'divertissement');

-- CreateEnum
CREATE TYPE "MotoStatus" AS ENUM ('available', 'rented', 'in_maintenance');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('awaiting', 'confirmed', 'canceled');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('repaired', 'replaced');

-- CreateEnum
CREATE TYPE "WarrantyStatus" AS ENUM ('in_progress', 'done', 'canceled');

-- CreateEnum
CREATE TYPE "BreakdownType" AS ENUM ('panne', 'accident');

-- CreateEnum
CREATE TYPE "BreakdownStatus" AS ENUM ('pending', 'resolved', 'in_progress');

-- CreateTable
CREATE TABLE "Notif" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "type" "NotifType" NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "NotifStatus" NOT NULL,

    CONSTRAINT "Notif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enterprise" (
    "id" INTEGER NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "industryType" "IndustryType" NOT NULL,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL,
    "idDealer" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestRide" (
    "id" SERIAL NOT NULL,
    "idClient" INTEGER NOT NULL,
    "idMoto" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT,
    "isCompleted" BOOLEAN NOT NULL,

    CONSTRAINT "TestRide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" SERIAL NOT NULL,
    "idClient" INTEGER NOT NULL,
    "idMoto" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moto" (
    "id" SERIAL NOT NULL,
    "idClient" INTEGER,
    "idDealer" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "status" "MotoStatus" NOT NULL,

    CONSTRAINT "Moto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotoPart" (
    "idMoto" INTEGER NOT NULL,
    "idPart" INTEGER NOT NULL,

    CONSTRAINT "MotoPart_pkey" PRIMARY KEY ("idMoto","idPart")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "idCommand" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stockQuantity" INTEGER NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Command" (
    "id" SERIAL NOT NULL,
    "parts" JSONB NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "status" "CommandStatus" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarrantyParts" (
    "idPart" INTEGER NOT NULL,
    "idWarranty" INTEGER NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "status" "WarrantyStatus" NOT NULL,
    "coveredCost" DOUBLE PRECISION NOT NULL,
    "remainingCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WarrantyParts_pkey" PRIMARY KEY ("idPart","idWarranty")
);

-- CreateTable
CREATE TABLE "Warranty" (
    "id" SERIAL NOT NULL,
    "idMoto" INTEGER NOT NULL,
    "warrantyType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "terms" TEXT,

    CONSTRAINT "Warranty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" SERIAL NOT NULL,
    "idMoto" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breakdown" (
    "id" SERIAL NOT NULL,
    "idMoto" INTEGER NOT NULL,
    "type" "BreakdownType" NOT NULL,
    "description" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "resolutionDate" TIMESTAMP(3),
    "status" "BreakdownStatus" NOT NULL,

    CONSTRAINT "Breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "idEntreprise" INTEGER NOT NULL,
    "idMoto" INTEGER NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Moto_registrationNumber_key" ON "Moto"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- AddForeignKey
ALTER TABLE "Notif" ADD CONSTRAINT "Notif_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dealer" ADD CONSTRAINT "Dealer_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enterprise" ADD CONSTRAINT "Enterprise_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_idDealer_fkey" FOREIGN KEY ("idDealer") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRide" ADD CONSTRAINT "TestRide_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRide" ADD CONSTRAINT "TestRide_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moto" ADD CONSTRAINT "Moto_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moto" ADD CONSTRAINT "Moto_idDealer_fkey" FOREIGN KEY ("idDealer") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoPart" ADD CONSTRAINT "MotoPart_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoPart" ADD CONSTRAINT "MotoPart_idPart_fkey" FOREIGN KEY ("idPart") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_idCommand_fkey" FOREIGN KEY ("idCommand") REFERENCES "Command"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarrantyParts" ADD CONSTRAINT "WarrantyParts_idPart_fkey" FOREIGN KEY ("idPart") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarrantyParts" ADD CONSTRAINT "WarrantyParts_idWarranty_fkey" FOREIGN KEY ("idWarranty") REFERENCES "Warranty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breakdown" ADD CONSTRAINT "Breakdown_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_idEntreprise_fkey" FOREIGN KEY ("idEntreprise") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_idMoto_fkey" FOREIGN KEY ("idMoto") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
