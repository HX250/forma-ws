export class DateUtils {
  static startOfDay(date: Date | string): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  static endOfDay(date: Date | string): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  static getDayRange(date: Date | string): { start: Date; end: Date } {
    return {
      start: this.startOfDay(date),
      end: this.endOfDay(date),
    };
  }
}
