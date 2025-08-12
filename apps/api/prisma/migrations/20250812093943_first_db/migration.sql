-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE');

-- CreateEnum
CREATE TYPE "FitnessExperience" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('LOSE_WEIGHT', 'GAIN_WEIGHT', 'MAINTAIN_WEIGHT', 'BUILD_MUSCLE', 'IMPROVE_ENDURANCE', 'GENERAL_FITNESS');

-- CreateEnum
CREATE TYPE "SpecializationField" AS ENUM ('POWERLIFTING', 'CROSSFIT', 'BODYBUILDING', 'WEIGHT_LOSS', 'STRENGTH_TRAINING', 'CARDIO', 'YOGA', 'PILATES', 'SPORTS_PERFORMANCE', 'REHABILITATION', 'NUTRITION');

-- CreateEnum
CREATE TYPE "CommunicationMethod" AS ENUM ('EMAIL', 'PHONE', 'TEXT_MESSAGE', 'IN_APP_MESSAGING');

-- CreateTable
CREATE TABLE "coaches" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "specializationFields" "SpecializationField"[],
    "certificates" TEXT[],
    "profilePhoto" TEXT,
    "bio" TEXT,
    "pricing" DECIMAL(10,2),
    "availability" TEXT,
    "timezone" TEXT,
    "communicationMethods" "CommunicationMethod"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "oneTimePassword" TEXT,
    "password" TEXT,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "currentWeight" DECIMAL(5,2) NOT NULL,
    "height" DECIMAL(5,2) NOT NULL,
    "activityLevel" "ActivityLevel" NOT NULL,
    "medicalConditions" TEXT,
    "fitnessExperience" "FitnessExperience" NOT NULL,
    "coachId" TEXT NOT NULL,
    "canTrackExercise" BOOLEAN NOT NULL DEFAULT false,
    "canTrackSleep" BOOLEAN NOT NULL DEFAULT false,
    "canTrackNutrition" BOOLEAN NOT NULL DEFAULT false,
    "canTrackWater" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_goals" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "goalType" "GoalType"[],
    "targetWeight" DECIMAL(5,2),
    "targetDate" TIMESTAMP(3),
    "calorieTarget" INTEGER,
    "proteinTarget" DECIMAL(6,2),
    "carbTarget" DECIMAL(6,2),
    "fatTarget" DECIMAL(6,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_entries" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" DECIMAL(6,2),
    "duration" INTEGER,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sleep_entries" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "bedTime" TIMESTAMP(3) NOT NULL,
    "wakeTime" TIMESTAMP(3) NOT NULL,
    "hoursSlept" DECIMAL(4,2) NOT NULL,
    "sleepQuality" INTEGER,
    "notes" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sleep_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_entries" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" DECIMAL(6,2),
    "carbs" DECIMAL(6,2),
    "fat" DECIMAL(6,2),
    "servingSize" TEXT,
    "mealType" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_entries" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(6,2) NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weigh_ins" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "bodyFatPercentage" DECIMAL(5,2),
    "muscleMass" DECIMAL(5,2),
    "notes" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weigh_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coaches_email_key" ON "coaches"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_goals_clientId_key" ON "client_goals"("clientId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_entries" ADD CONSTRAINT "exercise_entries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep_entries" ADD CONSTRAINT "sleep_entries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_entries" ADD CONSTRAINT "nutrition_entries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "water_entries" ADD CONSTRAINT "water_entries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weigh_ins" ADD CONSTRAINT "weigh_ins_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
