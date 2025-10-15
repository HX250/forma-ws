import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthResourceService } from './resources/auth.resource.service';
import {
  ButtonComponent,
  FormUtils,
  PageInput,
  PageSelect,
} from '@forma-ws/frontend-shared';
import { PageFormComponent } from '@forma-ws/frontend-shared';
import { AuthModel } from './models/auth.model';
import { UserType } from '@forma-ws/frontend/domain';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, PageInput, PageSelect, ButtonComponent],
  templateUrl: './auth.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent
  extends PageFormComponent<FormGroup<AuthModel.Form.Login>>
  implements OnInit
{
  userTypeOptions = [
    { label: 'Client', value: UserType.CLIENT },
    { label: 'Coach', value: UserType.COACH },
  ];

  constructor(
    private fb: FormBuilder,
    private authResourceService: AuthResourceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  request() {
    this.form.formLoader.set(false);
  }

  onSubmit() {
    console.log(this.form.value);
    this.sendRequest(
      this.authResourceService.login(this.form.getRawValue())
    ).subscribe((res) => {});
  }

  private buildForm() {
    return FormUtils.createFormGroup(
      this.fb.group({
        email: [''],
        password: [''],
        userType: [UserType.CLIENT],
      }) as FormGroup<AuthModel.Form.Login>
    );
  }
}
