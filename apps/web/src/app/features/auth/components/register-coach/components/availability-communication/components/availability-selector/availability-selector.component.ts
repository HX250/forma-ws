import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AvailabilityModel, DaysEnum } from '@forma-ws/frontend/domain';

@Component({
  selector: 'app-availability-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './availability-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilitySelectorComponent implements OnInit {
  control = input.required<FormControl<AvailabilityModel[]>>();
  label = input<string>('');

  days = signal<AvailabilityModel[]>([
    {
      day: DaysEnum.MONDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
    {
      day: DaysEnum.TUESDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
    {
      day: DaysEnum.WEDNESDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
    {
      day: DaysEnum.THURSDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
    {
      day: DaysEnum.FRIDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
    {
      day: DaysEnum.SATURDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
    {
      day: DaysEnum.SUNDAY,
      enabled: false,
      time: [{ from: '09:00', to: '17:00' }],
    },
  ]);

  ngOnInit(): void {
    this.loadFromControl();
  }

  private loadFromControl(): void {
    const value = this.control().value;
    if (value && Array.isArray(value) && value.length > 0) {
      this.days.set(value);
    }
  }

  toggleDay(dayIndex: number): void {
    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return { ...day, enabled: !day.enabled };
      }
      return day;
    });
    this.days.set(updated);
    this.updateControl();
  }

  addTimeSlot(dayIndex: number): void {
    const day = this.days()[dayIndex];
    if (day.time.length >= 3) {
      return;
    }

    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          time: [...day.time, { from: '09:00', to: '17:00' }],
        };
      }
      return day;
    });
    this.days.set(updated);
    this.updateControl();
  }

  canAddTimeSlot(dayIndex: number): boolean {
    return this.days()[dayIndex].time.length < 3;
  }

  removeTimeSlot(dayIndex: number, slotIndex: number): void {
    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          time: day.time.filter((_, i) => i !== slotIndex),
        };
      }
      return day;
    });
    this.days.set(updated);
    this.updateControl();
  }

  updateTimeSlot(
    dayIndex: number,
    slotIndex: number,
    field: 'from' | 'to',
    value: string
  ): void {
    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          time: day.time.map((slot, i) => {
            if (i === slotIndex) {
              return { ...slot, [field]: value };
            }
            return slot;
          }),
        };
      }
      return day;
    });
    this.days.set(updated);
    this.updateControl();
  }

  private updateControl(): void {
    const enabledDays = this.days().filter((day) => day.enabled);

    if (enabledDays.length > 0) {
      this.control().setValue(enabledDays);
    } else {
      this.control().setValue([]);
    }
    this.control().markAsTouched();
  }
}
