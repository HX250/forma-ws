/*
  Warnings:

  - You are about to drop the column `calorieTarget` on the `client_goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "client_goals" DROP COLUMN "calorieTarget",
ADD COLUMN     "caloriesGoal" INTEGER,
ADD COLUMN     "exerciseGoal" DECIMAL(6,2),
ADD COLUMN     "sleepGaol" DECIMAL(6,2),
ADD COLUMN     "waterGoal" DECIMAL(6,2),
ADD COLUMN     "weightGoal" DECIMAL(6,2);
