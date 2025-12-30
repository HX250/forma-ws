import { FormControl } from '@angular/forms';

export interface SleepTrackingFromModel {
  bedTime: FormControl<string>;
  wakeTime: FormControl<string>;
  sleepQuality: FormControl<number>;
  notes: FormControl<string>;
}
