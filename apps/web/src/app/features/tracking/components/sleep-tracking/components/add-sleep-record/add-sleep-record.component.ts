import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { TranslateModule } from '@ngx-translate/core';
import {
  FormUtils,
  PageFormComponent,
  PageInputComponent,
  PageTimePickerComponent,
  RatingOption,
  PageHorizontalRadioComponent,
  AlertService,
  AlertType,
  DateUtils,
  bedTimeAfterWakeTimeValidator,
  ButtonComponent,
  ButtonProperties,
} from '@forma-ws/frontend-shared';
import { SleepTrackingFromModel } from '../../models/sleep-tracking-form.model';
import { SleepTrackingResourceService } from '../../resource/sleep-tracking.resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sleep-tracking',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    PageInputComponent,
    PageTimePickerComponent,
    PageHorizontalRadioComponent,
    ButtonComponent,
  ],
  templateUrl: './add-sleep-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SleepTrackingResourceService],
})
export class AddSleepRecordComponent
  extends PageFormComponent<FormGroup<SleepTrackingFromModel>>
  implements OnInit, OnDestroy
{
  private readonly fb = inject(FormBuilder);
  private readonly sleepResourceService = inject(SleepTrackingResourceService);
  private readonly alertService = inject(AlertService);

  today = signal<Date>(new Date());
  sleepDate = signal<Date>(this.yesterday);
  clientId = signal<string>('');
  isSubmitting = signal(false);
  ButtonProperties = ButtonProperties;

  ratingOptions = signal<RatingOption[]>([
    { value: 1, label: 'Very Poor' },
    { value: 2, label: 'Poor' },
    { value: 3, label: 'Fair' },
    { value: 4, label: 'Good' },
    { value: 5, label: 'Excellent' },
  ]);

  subscription!: Subscription;

  modalRef!: { close: (result?: any) => void };
  AlertType = AlertType;

  get control() {
    return this.form.controls;
  }

  get yesterday(): Date {
    const date = new Date(this.today());
    date.setDate(date.getDate() - 1);
    return date;
  }

  ngOnInit() {
    this.form = this.buildForm();

    this.form.controls.bedTime.setValidators([
      Validators.required,
      bedTimeAfterWakeTimeValidator(this.form.controls.wakeTime, () =>
        this.sleepDate()
      ),
    ]);

    this.control.wakeTime.valueChanges.subscribe(() => {
      this.control.bedTime.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {}

  onDateChange(value: string) {
    this.sleepDate.set(new Date(value));
    this.control.bedTime.updateValueAndValidity();
  }

  private buildForm() {
    return FormUtils.createFormGroup(
      this.fb.group({
        bedTime: [''],
        wakeTime: ['', [Validators.required]],
        sleepQuality: [
          null as number | null,
          [Validators.required, Validators.min(1), Validators.max(5)],
        ],
        notes: [''],
      }) as FormGroup<SleepTrackingFromModel>
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sendFormRequest(
      this.sleepResourceService.logSleepEntry(
        this.getMappedForm(this.form.getRawValue())
      )
    ).subscribe({
      next: () => {
        this.alertService.show(AlertType.SUCCESS, 'Sleep has been recorded');
        this.modalRef?.close(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.alertService.show(AlertType.ERROR, 'Failed to record sleep');
      },
    });
  }

  private getMappedForm(form: {
    bedTime: string;
    wakeTime: string;
    sleepQuality: number;
    notes: string;
  }) {
    return {
      ...form,
      clientId: this.clientId()!,
      bedTime: DateUtils.combineDateAndTime(
        this.sleepDate(),
        this.control.bedTime.getRawValue()
      ).toISOString(),
      wakeTime: DateUtils.combineDateAndTime(
        this.today(),
        this.control.wakeTime.getRawValue()
      ).toISOString(),
    };
  }
}
