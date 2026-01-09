import { PrismaClient, ExerciseCategory, MuscleFocus } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  {
    name: 'Bench Press',
    nameSk: 'Tlaky na lavičke',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.CHEST,
    isVerified: true,
  },
  {
    name: 'Squat',
    nameSk: 'Drepy',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.LEGS,
    isVerified: true,
  },
  {
    name: 'Deadlift',
    nameSk: 'Mŕtvy ťah',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.BACK,
    isVerified: true,
  },
  {
    name: 'Overhead Press',
    nameSk: 'Tlaky nad hlavou',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.SHOULDERS,
    isVerified: true,
  },
  {
    name: 'Bicep Curl',
    nameSk: 'Bicepsový zdvih',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.ARMS,
    isVerified: true,
  },
  {
    name: 'Pull-Up',
    nameSk: 'Zhyby',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.BACK,
    isVerified: true,
  },
  {
    name: 'Plank',
    nameSk: 'Doska',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.CORE,
    isVerified: true,
  },
  {
    name: 'Running',
    nameSk: 'Beh',
    category: ExerciseCategory.CARDIO,
    primaryMuscle: MuscleFocus.CARDIO,
    isVerified: true,
  },
  {
    name: 'Cycling',
    nameSk: 'Cyklistika',
    category: ExerciseCategory.CARDIO,
    primaryMuscle: MuscleFocus.CARDIO,
    isVerified: true,
  },
  {
    name: 'Jump Rope',
    nameSk: 'Skákanie cez švihadlo',
    category: ExerciseCategory.CARDIO,
    primaryMuscle: MuscleFocus.FULL_BODY,
    isVerified: true,
  },
  {
    name: 'Yoga Stretch',
    nameSk: 'Joga – strečing',
    category: ExerciseCategory.YOGA,
    primaryMuscle: MuscleFocus.FULL_BODY,
    isVerified: true,
  },
  {
    name: 'Lunges',
    nameSk: 'Výpady',
    category: ExerciseCategory.STRENGTH,
    primaryMuscle: MuscleFocus.LEGS,
    isVerified: true,
  },
];

async function main() {
  console.log('Starting exercise seed...');

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    });
  }

  console.log(`Seeded ${exercises.length} exercises`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
