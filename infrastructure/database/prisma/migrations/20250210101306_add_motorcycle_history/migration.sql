-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "motorcycleHistoryId" TEXT;

-- AlterTable
ALTER TABLE "maintenancies" ADD COLUMN     "motorcycleHistoryId" TEXT;

-- CreateTable
CREATE TABLE "MotorcycleHistory" (
    "id" TEXT NOT NULL,
    "motorcycleId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "clientId" TEXT,
    "enterpriseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotorcycleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MotorcycleHistoryToDriver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MotorcycleHistoryToDriver_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "MotorcycleHistory_motorcycleId_idx" ON "MotorcycleHistory"("motorcycleId");

-- CreateIndex
CREATE INDEX "MotorcycleHistory_clientId_idx" ON "MotorcycleHistory"("clientId");

-- CreateIndex
CREATE INDEX "MotorcycleHistory_enterpriseId_idx" ON "MotorcycleHistory"("enterpriseId");

-- CreateIndex
CREATE INDEX "_MotorcycleHistoryToDriver_B_index" ON "_MotorcycleHistoryToDriver"("B");

-- AddForeignKey
ALTER TABLE "maintenancies" ADD CONSTRAINT "maintenancies_motorcycleHistoryId_fkey" FOREIGN KEY ("motorcycleHistoryId") REFERENCES "MotorcycleHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_motorcycleHistoryId_fkey" FOREIGN KEY ("motorcycleHistoryId") REFERENCES "MotorcycleHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotorcycleHistory" ADD CONSTRAINT "MotorcycleHistory_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotorcycleHistory" ADD CONSTRAINT "MotorcycleHistory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotorcycleHistory" ADD CONSTRAINT "MotorcycleHistory_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MotorcycleHistoryToDriver" ADD CONSTRAINT "_MotorcycleHistoryToDriver_A_fkey" FOREIGN KEY ("A") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MotorcycleHistoryToDriver" ADD CONSTRAINT "_MotorcycleHistoryToDriver_B_fkey" FOREIGN KEY ("B") REFERENCES "MotorcycleHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
