import { FormControl, Validators } from '@angular/forms';

export class FormProperties {
  getRequiredControls(control: FormControl) {
    if (control.hasValidator(Validators.required)) {
      return true;
    }
    return false;
  }
}
