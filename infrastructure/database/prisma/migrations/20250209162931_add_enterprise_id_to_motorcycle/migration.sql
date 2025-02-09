/*
  Warnings:

  - Added the required column `enterpriseId` to the `motorcycles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "motorcycles" ADD COLUMN     "enterpriseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
