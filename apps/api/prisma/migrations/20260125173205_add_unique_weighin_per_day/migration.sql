/*
  Warnings:

  - A unique constraint covering the columns `[clientId,date]` on the table `weigh_ins` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "weigh_ins" ALTER COLUMN "date" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "weigh_ins_clientId_date_key" ON "weigh_ins"("clientId", "date");
