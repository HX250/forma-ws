import { FormControl } from '@angular/forms';
import { UserType } from '@forma-ws/frontend/domain';

export namespace AuthModel {
  export namespace Form {
    export interface Login {
      email: FormControl<string>;
      password: FormControl<string>;
      userType: FormControl<UserType>;
    }
  }
}
