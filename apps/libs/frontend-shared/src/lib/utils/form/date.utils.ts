import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class DateUtils {
  static formatDateWithTime(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0];

    return `${day}/${month}/${year} ${time}`;
  }

  static combineDateAndTime(date: Date | string, time: string): Date {
    const dt = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    dt.setHours(hours, minutes, 0, 0);
    return dt;
  }

  static isToday(date: Date) {
    const today = new Date();

    return date.getDate() === today.getDate();
  }

  static compareDates(
    compareDate: Date,
    firstDate: string,
    secondDate: string
  ): boolean {
    if (!firstDate || !secondDate) return false;

    const first = new Date(compareDate);
    const second = new Date(compareDate);

    const [firstHours, firstMinutes] = firstDate.split(':').map(Number);
    const [secondHours, secondMinutes] = secondDate.split(':').map(Number);

    first.setHours(firstHours, firstMinutes, 0, 0);
    second.setHours(secondHours, secondMinutes, 0, 0);

    return first > second;
  }
}

export function bedTimeAfterWakeTimeValidator(
  secondControl: AbstractControl,
  getCompareDate: () => Date
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const firstDate = control.value;
    const secondDate = secondControl.value;

    if (!firstDate || !secondDate) return null;

    const compareDate = getCompareDate();

    if (!DateUtils.isToday(compareDate)) return null;

    return DateUtils.compareDates(compareDate, firstDate, secondDate)
      ? { dateAfterTargetDate: true }
      : null;
  };
}
