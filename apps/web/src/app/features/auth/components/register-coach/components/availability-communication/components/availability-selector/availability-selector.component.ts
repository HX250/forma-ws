import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayAvailability {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

@Component({
  selector: 'app-availability-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './availability-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilitySelectorComponent implements OnInit {
  control = input.required<FormControl<string>>();
  label = input<string>('');

  days = signal<DayAvailability[]>([
    { day: 'MONDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'TUESDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'WEDNESDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'THURSDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'FRIDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'SATURDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
    { day: 'SUNDAY', enabled: false, timeSlots: [{ start: '09:00', end: '17:00' }] },
  ]);

  ngOnInit(): void {
    this.loadFromControl();
  }

  private loadFromControl(): void {
    const value = this.control().value;
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          this.days.set(parsed);
        }
      } catch {
      }
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
    if (day.timeSlots.length >= 3) {
      return;
    }
    
    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          timeSlots: [...day.timeSlots, { start: '09:00', end: '17:00' }],
        };
      }
      return day;
    });
    this.days.set(updated);
    this.updateControl();
  }

  canAddTimeSlot(dayIndex: number): boolean {
    return this.days()[dayIndex].timeSlots.length < 3;
  }

  removeTimeSlot(dayIndex: number, slotIndex: number): void {
    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          timeSlots: day.timeSlots.filter((_, i) => i !== slotIndex),
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
    field: 'start' | 'end',
    value: string
  ): void {
    const updated = this.days().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          timeSlots: day.timeSlots.map((slot, i) => {
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
    const hasEnabledDay = this.days().some((day) => day.enabled);
    
    if (hasEnabledDay) {
      const value = JSON.stringify(this.days());
      this.control().setValue(value);
    } else {
      this.control().setValue('');
    }
    
    this.control().markAsTouched();
  }
}

