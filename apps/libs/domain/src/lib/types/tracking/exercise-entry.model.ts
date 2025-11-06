export interface ExerciseEntry {
  id: string;
  clientId: string;
  exerciseName: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  date: Date;
  createdAt: Date;
}
