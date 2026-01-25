import { FormControl } from '@angular/forms';

export interface WeighInFormModel {
  weight: FormControl<number>;
  bodyFatPercentage: FormControl<number>;
  muscleMass: FormControl<number>;
  notes: FormControl<string>;
}
