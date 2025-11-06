import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@forma-ws/frontend-shared';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, PageInput, ButtonComponent, RouterLink],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent
  extends PageFormComponent<FormGroup<AuthModel.Form.Login>>
  implements OnInit
{
  private fb = inject(FormBuilder);
  private authResourceService = inject(AuthResourceService);
  private securityService = inject(SecurityService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  readonly ButtonProperties = ButtonProperties;
  readonly UserType = UserType;

  userTypeOptions = [
    { label: 'Client', value: UserType.CLIENT },
    { label: 'Coach', value: UserType.COACH },
  ];

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
      this.authResourceService.login(this.form.getRawValue()).pipe(
        tap((authPayload) => this.securityService.setAuthPayload(authPayload)),
        switchMap(() => this.authResourceService.getCurrentUser()),
        tap((user) => this.securityService.setCurrentUser(user))
      )
    ).subscribe({
      next: () => {
        this.alertService.show(AlertType.SUCCESS, 'Login successful');
        this.router.navigateByUrl('/dashboard');
      },
    });
  }

  private buildForm() {
    return FormUtils.createFormGroup(
      this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        userType: [UserType.CLIENT],
      }) as FormGroup<AuthModel.Form.Login>
    );
  }
}
