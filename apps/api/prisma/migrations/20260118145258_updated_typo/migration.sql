/*
  Warnings:

  - You are about to drop the column `sleepGaol` on the `client_goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "client_goals" DROP COLUMN "sleepGaol",
ADD COLUMN     "sleepGoal" DECIMAL(6,2);
