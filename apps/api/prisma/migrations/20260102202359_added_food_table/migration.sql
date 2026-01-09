/*
  Warnings:

  - The `servingSize` column on the `nutrition_entries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "nutrition_entries" ADD COLUMN     "foodId" TEXT,
DROP COLUMN "servingSize",
ADD COLUMN     "servingSize" DECIMAL(6,2);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameSk" TEXT,
    "category" TEXT,
    "caloriesPer100g" DECIMAL(7,2) NOT NULL,
    "proteinPer100g" DECIMAL(6,2) NOT NULL,
    "carbsPer100g" DECIMAL(6,2) NOT NULL,
    "fatPer100g" DECIMAL(6,2) NOT NULL,
    "fiberPer100g" DECIMAL(6,2),
    "sugarPer100g" DECIMAL(6,2),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "foods_name_idx" ON "foods"("name");

-- CreateIndex
CREATE INDEX "foods_nameSk_idx" ON "foods"("nameSk");

-- CreateIndex
CREATE INDEX "foods_category_idx" ON "foods"("category");

-- AddForeignKey
ALTER TABLE "nutrition_entries" ADD CONSTRAINT "nutrition_entries_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
