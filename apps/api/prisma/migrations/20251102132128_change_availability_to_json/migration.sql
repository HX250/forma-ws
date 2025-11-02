/*
  Warnings:

  - You are about to drop the column `certificates` on the `coaches` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `coaches` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `coaches` table. All the data in the column will be lost.
  - The `availability` column on the `coaches` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "coaches" DROP COLUMN "certificates",
DROP COLUMN "profilePhoto",
DROP COLUMN "timezone",
DROP COLUMN "availability",
ADD COLUMN     "availability" JSONB;
