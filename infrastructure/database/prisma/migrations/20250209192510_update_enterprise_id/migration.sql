-- DropForeignKey
ALTER TABLE "motorcycles" DROP CONSTRAINT "motorcycles_enterpriseId_fkey";

-- AlterTable
ALTER TABLE "motorcycles" ALTER COLUMN "enterpriseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
