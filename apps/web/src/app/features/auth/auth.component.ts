import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthResourceService } from './resources/auth.resource.service';
import {
  AlertType,
  ButtonComponent,
  FormUtils,
  PageInput,
} from '@forma-ws/frontend-shared';
import { PageFormComponent, ButtonProperties } from '@forma-ws/frontend-shared';
import { AuthModel } from './models/auth.model';
import { UserType } from '@forma-ws/frontend/domain';
import { SecurityService } from '../../core/auth/security.service';
import { Router } from '@angular/router';
import { AlertService } from '@forma-ws/frontend-shared';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, PageInput, ButtonComponent],
  templateUrl: './auth.component.html',
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
  readonly ButtonProperties = ButtonProperties;
  readonly UserType = UserType;

  constructor(
    private fb: FormBuilder,
    private authResourceService: AuthResourceService,
    private securityService: SecurityService,
    private router: Router,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  changeRole(role: UserType) {
    this.form.controls.userType.setValue(role);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sendRequest(
      this.authResourceService.login(this.form.getRawValue())
    ).subscribe({
      next: (res) => {
        this.securityService.setLoggedIn(true);
        this.securityService.setCurrentUser(res.userId);
        this.alertService.show(AlertType.SUCCESS, 'Login successful');
        this.router.navigateByUrl('/dashboard');
      },
    });
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
