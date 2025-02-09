/*
  Warnings:

  - You are about to drop the column `idEnterprise` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `idMotorcycle` on the `drivers` table. All the data in the column will be lost.
  - Added the required column `enterpriseId` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motorcycleId` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_idEnterprise_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_idMotorcycle_fkey";

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "idEnterprise",
DROP COLUMN "idMotorcycle",
ADD COLUMN     "enterpriseId" TEXT NOT NULL,
ADD COLUMN     "motorcycleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "motorcycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
