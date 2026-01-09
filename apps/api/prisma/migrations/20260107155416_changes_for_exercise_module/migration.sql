-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE', 'HIIT', 'YOGA', 'PILATES', 'MOBILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "MuscleFocus" AS ENUM ('CHEST', 'BACK', 'LEGS', 'ARMS', 'SHOULDERS', 'CORE', 'FULL_BODY', 'CARDIO', 'OTHER');

-- AlterTable
ALTER TABLE "exercise_entries" ADD COLUMN     "exerciseId" TEXT;

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameSk" TEXT,
    "category" "ExerciseCategory" NOT NULL DEFAULT 'OTHER',
    "primaryMuscle" "MuscleFocus" NOT NULL DEFAULT 'OTHER',
    "secondaryMuscle" "MuscleFocus",
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exercises_name_idx" ON "exercises"("name");

-- CreateIndex
CREATE INDEX "exercises_nameSk_idx" ON "exercises"("nameSk");

-- CreateIndex
CREATE INDEX "exercises_category_idx" ON "exercises"("category");

-- CreateIndex
CREATE INDEX "exercises_primaryMuscle_idx" ON "exercises"("primaryMuscle");

-- CreateIndex
CREATE INDEX "exercise_entries_clientId_createdAt_idx" ON "exercise_entries"("clientId", "createdAt");

-- AddForeignKey
ALTER TABLE "exercise_entries" ADD CONSTRAINT "exercise_entries_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
