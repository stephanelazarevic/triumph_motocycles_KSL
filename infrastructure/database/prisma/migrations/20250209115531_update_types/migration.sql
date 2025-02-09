/*
  Warnings:

  - The `phoneNumber` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `phoneNumber` on the `drivers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "phoneNumber",
ADD COLUMN     "phoneNumber" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "token" TEXT,
DROP COLUMN "phoneNumber",
ADD COLUMN     "phoneNumber" JSONB;
