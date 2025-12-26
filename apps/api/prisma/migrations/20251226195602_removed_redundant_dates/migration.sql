/*
  Warnings:

  - You are about to drop the column `date` on the `exercise_entries` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `nutrition_entries` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `sleep_entries` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `water_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exercise_entries" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "nutrition_entries" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "sleep_entries" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "water_entries" DROP COLUMN "date";
