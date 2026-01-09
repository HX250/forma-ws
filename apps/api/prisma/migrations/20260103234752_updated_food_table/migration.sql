/*
  Warnings:

  - Added the required column `foodNameSk` to the `nutrition_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealType` to the `nutrition_entries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- AlterTable
ALTER TABLE "nutrition_entries" ADD COLUMN     "foodNameSk" TEXT NOT NULL,
DROP COLUMN "mealType",
ADD COLUMN     "mealType" "MealType" NOT NULL;

-- CreateIndex
CREATE INDEX "nutrition_entries_clientId_createdAt_idx" ON "nutrition_entries"("clientId", "createdAt");
