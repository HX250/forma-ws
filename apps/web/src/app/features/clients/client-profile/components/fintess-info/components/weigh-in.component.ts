import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertService,
  AlertType,
  FormaFormContainer,
  FormUtils,
  PageFormComponent,
  PageInputComponent,
  PageNumberComponent,
  ButtonComponent,
  ButtonProperties,
} from '@forma-ws/frontend-shared';
import { WeighInFormModel } from './models/weigh-in-form.model';
import { WeighInResourceService } from './resources/weigh-in.resource.service';

@Component({
  selector: 'app-weigh-in',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    PageInputComponent,
    PageNumberComponent,
    ButtonComponent,
  ],
  templateUrl: './weigh-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WeighInResourceService],
})
export class WeighInComponent
  extends PageFormComponent<FormGroup<WeighInFormModel>>
  implements OnInit
{
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly weighInResourceService = inject(WeighInResourceService);
  private readonly alertService = inject(AlertService);

  clientId = signal<string>('');
  ButtonProperties = ButtonProperties;

  modalRef!: { close: (result?: any) => void };

  get control() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.buildForm();

    this.checkForDailyData();
  }

  onSubmit() {
    this.sendFormRequest(
      this.weighInResourceService.logDailyWeighIn(
        this.clientId(),
        this.form.getRawValue()
      )
    ).subscribe(() => {
      this.alertService.show(
        AlertType.SUCCESS,
        'CLIENT_PROFILE.FITNESS_INFO.ALERTS.WEIGHT_RECORDED'
      );
      this.modalRef.close(true);
    });
  }

  private checkForDailyData() {
    this.sendFormRequest(
      this.weighInResourceService.getDailyData(this.clientId())
    ).subscribe((res) => {
      this.form.patchValue(res);
    });
  }

  private buildForm(): FormaFormContainer<FormGroup<WeighInFormModel>> {
    return FormUtils.createFormGroup(
      this.fb.group({
        weight: [0, [Validators.required]],
        bodyFatPercentage: [0, []],
        muscleMass: [0, []],
        notes: ['', []],
      })
    );
  }
}
