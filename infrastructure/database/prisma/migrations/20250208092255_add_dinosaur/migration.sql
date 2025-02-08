-- CreateTable
CREATE TABLE "Dinosaur" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Dinosaur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dinosaur_name_key" ON "Dinosaur"("name");
