/*
  Warnings:

  - You are about to drop the column `secondaryMuscle` on the `exercises` table. All the data in the column will be lost.
  - Added the required column `exerciseNameSk` to the `exercise_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercise_entries" ADD COLUMN     "exerciseNameSk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "secondaryMuscle";
