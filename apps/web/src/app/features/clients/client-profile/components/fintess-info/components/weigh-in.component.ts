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
  FormsModule,
  Validators,
} from '@angular/forms';

import {
  AlertService,
  AlertType,
  FormaFormContainer,
  FormUtils,
  PageFormComponent,
  PageInputComponent,
  PageNumberComponent,
} from '@forma-ws/frontend-shared';
import { WeighInFormModel } from './models/weigh-in-form.model';
import { WeighInResourceService } from './resources/weigh-in.resource.service';

@Component({
  selector: 'app-add-exercise-record',
  imports: [CommonModule, FormsModule, PageInputComponent, PageNumberComponent],
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
      this.alertService.show(AlertType.SUCCESS, 'Vaha bola zaznamenana');
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
