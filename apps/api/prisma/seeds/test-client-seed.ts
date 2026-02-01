import {
  PrismaClient,
  Gender,
  ActivityLevel,
  FitnessExperience,
  GoalType,
  MealType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coachId = 'cmhhr7m5800013yf3ohpgsjj7';

  const client = await prisma.client.create({
    data: {
      email: 'john.doe@example.com',
      password: '',
      oneTimePassword: '123456789',
      isFirstLogin: false,
      firstName: 'John',
      lastName: 'Doe',
      gender: Gender.MALE,
      birthDate: new Date('1990-05-15'),
      currentWeight: 85.5,
      height: 178.0,
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
      medicalConditions: 'None',
      fitnessExperience: FitnessExperience.INTERMEDIATE,
      coachId: coachId,
      canTrackExercise: true,
      canTrackSleep: true,
      canTrackNutrition: true,
      canTrackWater: true,
    },
  });

  console.log('Created client:', client.id);

  await prisma.clientGoal.create({
    data: {
      clientId: client.id,
      goalType: [GoalType.LOSE_WEIGHT, GoalType.BUILD_MUSCLE],
      targetWeight: 78.0,
      targetDate: new Date('2026-10-01'),
      caloriesGoal: 2200,
      proteinTarget: 165.0,
      carbTarget: 220.0,
      fatTarget: 75.0,
      fiberTarget: 30.0,
      sugarTarget: 50.0,
      sleepGoal: 8.0,
      waterGoal: 3.0,
      weightGoal: 78.0,
      exerciseGoal: 5.0,
    },
  });

  console.log('Created client goals');

  const exercises = await prisma.exercise.findMany({ take: 20 });
  const foods = await prisma.food.findMany({ take: 50 });

  const startDate = new Date('2025-06-01');
  const endDate = new Date('2026-02-01');
  const dayInMs = 24 * 60 * 60 * 1000;

  let currentDate = new Date(startDate);
  let currentWeight = 85.5;
  const weightLossPerDay = 0.03;

  console.log('Starting to generate 8 months of daily data...');

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    console.log(`Generating data for ${dateStr}`);

    currentWeight -= weightLossPerDay + (Math.random() * 0.02 - 0.01);
    currentWeight = Math.max(currentWeight, 78.0);

    await prisma.weighIn.create({
      data: {
        clientId: client.id,
        weight: Number(currentWeight.toFixed(2)),
        bodyFatPercentage: Number(
          (20 - (85.5 - currentWeight) * 0.15).toFixed(2)
        ),
        muscleMass: Number((35 + (85.5 - currentWeight) * 0.05).toFixed(2)),
        date: new Date(currentDate.toISOString().split('T')[0]),
        notes: Math.random() > 0.7 ? 'Feeling good today!' : null,
      },
    });

    const sleepHours = 6.5 + Math.random() * 2;
    const bedTime = new Date(currentDate);
    bedTime.setHours(
      22 + Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 60)
    );
    const wakeTime = new Date(bedTime);
    wakeTime.setHours(
      bedTime.getHours() + Math.floor(sleepHours),
      Math.floor((sleepHours % 1) * 60)
    );

    await prisma.sleepEntry.create({
      data: {
        clientId: client.id,
        bedTime: bedTime,
        wakeTime: wakeTime,
        hoursSlept: Number(sleepHours.toFixed(2)),
        sleepQuality: Math.floor(Math.random() * 3) + 7,
        notes: Math.random() > 0.8 ? 'Woke up a few times' : null,
      },
    });

    const waterEntryCount = 2 + Math.floor(Math.random() * 3);
    for (let w = 0; w < waterEntryCount; w++) {
      const waterTime = new Date(currentDate);
      waterTime.setHours(8 + w * 4, Math.floor(Math.random() * 60));

      await prisma.waterEntry.create({
        data: {
          clientId: client.id,
          amount: Number((0.3 + Math.random() * 0.5).toFixed(2)),
          createdAt: waterTime,
        },
      });
    }

    const mealTypes = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER];
    const mealTimes = [8, 13, 19];

    for (let m = 0; m < mealTypes.length; m++) {
      const mealTime = new Date(currentDate);
      mealTime.setHours(mealTimes[m], Math.floor(Math.random() * 60));

      const foodCount = 2 + Math.floor(Math.random() * 3);
      for (let f = 0; f < foodCount; f++) {
        const food = foods[Math.floor(Math.random() * foods.length)];
        const servingSize = 100 + Math.random() * 150;

        const multiplier = servingSize / 100;

        await prisma.nutritionEntry.create({
          data: {
            clientId: client.id,
            foodId: food?.id || null,
            foodName: food?.name || 'Custom Food',
            foodNameSk: food?.nameSk || 'Vlastné jedlo',
            calories: Math.round(
              Number(food?.caloriesPer100g || 200) * multiplier
            ),
            protein: Number(
              (Number(food?.proteinPer100g || 20) * multiplier).toFixed(2)
            ),
            carbs: Number(
              (Number(food?.carbsPer100g || 30) * multiplier).toFixed(2)
            ),
            fat: Number(
              (Number(food?.fatPer100g || 10) * multiplier).toFixed(2)
            ),
            fiber: Number(
              (Number(food?.fiberPer100g || 3) * multiplier).toFixed(2)
            ),
            sugar: Number(
              (Number(food?.sugarPer100g || 5) * multiplier).toFixed(2)
            ),
            servingSize: Number(servingSize.toFixed(2)),
            mealType: mealTypes[m],
            createdAt: mealTime,
          },
        });
      }
    }

    if (Math.random() > 0.3) {
      const snackCount = 1 + Math.floor(Math.random() * 2);
      for (let s = 0; s < snackCount; s++) {
        const snackTime = new Date(currentDate);
        snackTime.setHours(10 + s * 6, Math.floor(Math.random() * 60));

        const food = foods[Math.floor(Math.random() * foods.length)];
        const servingSize = 50 + Math.random() * 100;
        const multiplier = servingSize / 100;

        await prisma.nutritionEntry.create({
          data: {
            clientId: client.id,
            foodId: food?.id || null,
            foodName: food?.name || 'Snack',
            foodNameSk: food?.nameSk || 'Občerstvenie',
            calories: Math.round(
              Number(food?.caloriesPer100g || 150) * multiplier
            ),
            protein: Number(
              (Number(food?.proteinPer100g || 5) * multiplier).toFixed(2)
            ),
            carbs: Number(
              (Number(food?.carbsPer100g || 20) * multiplier).toFixed(2)
            ),
            fat: Number(
              (Number(food?.fatPer100g || 8) * multiplier).toFixed(2)
            ),
            fiber: Number(
              (Number(food?.fiberPer100g || 2) * multiplier).toFixed(2)
            ),
            sugar: Number(
              (Number(food?.sugarPer100g || 10) * multiplier).toFixed(2)
            ),
            servingSize: Number(servingSize.toFixed(2)),
            mealType: MealType.SNACK,
            createdAt: snackTime,
          },
        });
      }
    }

    const shouldExercise = Math.random() > 0.3;
    if (shouldExercise) {
      const exerciseCount = 3 + Math.floor(Math.random() * 4);

      for (let e = 0; e < exerciseCount; e++) {
        const exerciseTime = new Date(currentDate);
        exerciseTime.setHours(
          17 + Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 60)
        );

        const exercise =
          exercises[Math.floor(Math.random() * exercises.length)];
        const isCardio = Math.random() > 0.7;

        await prisma.exerciseEntry.create({
          data: {
            clientId: client.id,
            exerciseId: exercise?.id || null,
            exerciseName: exercise?.name || 'Custom Exercise',
            exerciseNameSk: exercise?.nameSk || 'Vlastné cvičenie',
            sets: isCardio ? null : 3 + Math.floor(Math.random() * 2),
            reps: isCardio ? null : 8 + Math.floor(Math.random() * 5),
            weight: isCardio
              ? null
              : Number((20 + Math.random() * 60).toFixed(2)),
            duration: isCardio ? 20 + Math.floor(Math.random() * 25) : null,
            notes: Math.random() > 0.8 ? 'Felt strong today' : null,
            createdAt: exerciseTime,
          },
        });
      }
    }

    currentDate = new Date(currentDate.getTime() + dayInMs);
  }

  console.log('✅ Successfully generated 8 months of daily data!');
  console.log(`Client ID: ${client.id}`);
  console.log(`Email: ${client.email}`);
  console.log(
    `Data range: ${startDate.toISOString().split('T')[0]} to ${
      endDate.toISOString().split('T')[0]
    }`
  );
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
