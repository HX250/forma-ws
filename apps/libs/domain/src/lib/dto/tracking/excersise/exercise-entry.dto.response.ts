import { ExerciseCategory, MuscleFocus } from '@forma-ws/frontend/domain';

export interface ExerciseDetailList {
  id: string;
  name: string;
  nameSk: string;
  category: ExerciseCategory;
  primaryMuscle: MuscleFocus;
}

export interface ExerciseSummary {
  totalExercises: number;
  totalDuration: number;
  totalSets: number;
  totalReps: number;
  entries: ExerciseEntryDetail[];
}

export interface ExerciseEntryDetail {
  id: string;
  name: string;
  nameSk: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
  duration: number;
}

export interface ExerciseDetail {
  id: string;
  name: string;
  nameSk: string;
  category: ExerciseCategory;
  primaryMuscle: MuscleFocus;
  isVerified: boolean;
  isCustom: boolean;
}
