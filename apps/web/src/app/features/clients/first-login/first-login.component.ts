import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertService,
  AlertType,
  FormUtils,
  PageFormComponent,
  PageInputComponent,
} from '@forma-ws/frontend-shared';
import { FirstLoginFormModel } from './models/first-login.model';
import { Router } from '@angular/router';
import { FirstLoginResourceService } from './resources/first-login.resource.service';

@Component({
  selector: 'app-first-login',
  imports: [CommonModule, FormsModule, PageInputComponent],
  templateUrl: './first-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FirstLoginResourceService],
})
export class FirstLoginComponent
  extends PageFormComponent<FormGroup<FirstLoginFormModel>>
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly firstLoginResourceService = inject(
    FirstLoginResourceService
  );

  AlertType = AlertType;

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  changePassword(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sendFormRequest(
      this.firstLoginResourceService.setPassword(this.form.getRawValue())
    ).subscribe({
      next: () => {
        this.alertService.show(
          AlertType.SUCCESS,
          'FIRST_LOGIN.PASSWORD_CHANGED'
        );
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard');
      },
    });
  }

  private buildForm() {
    return FormUtils.createFormGroup(
      this.fb.group({
        newPassword: ['', Validators.required],
      }) as FormGroup<FirstLoginFormModel>
    );
  }
}
