export interface SleepEntryData {
  id: string;
  bedTime: Date;
  wakeTime: Date;
  hoursSlept: number;
  sleepQuality?: number;
  notes?: string;
  createdAt: Date;
}
