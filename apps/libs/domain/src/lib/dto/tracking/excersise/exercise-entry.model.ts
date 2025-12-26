export interface ExerciseEntry {
  id: string;
  clientId: string;
  exerciseName: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  createdAt: Date;
}

export interface ExerciseSummary {
  totalExercises: number;
  totalDuration: number;
  totalSets: number;
  totalReps: number;
  entries: ExerciseEntry[];
  lastExercise?: ExerciseEntry;
}
