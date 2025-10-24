import { Injectable, signal } from '@angular/core';
import { Alert, AlertType } from './alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly MAX_ALERTS = 5;
  private readonly ALERT_DURATION = 5000;

  alerts = signal<Alert[]>([]);

  show(type: AlertType, text: string, header?: string): void {
    const id = this.generateId();
    const alert: Alert = { id, type, text, header };

    this.alerts.update((current) => {
      const updated = [...current, alert];
      return updated.slice(-this.MAX_ALERTS);
    });

    setTimeout(() => {
      this.remove(id);
    }, this.ALERT_DURATION);
  }

  remove(id: string): void {
    this.alerts.update((current) => current.filter((alert) => alert.id !== id));
  }

  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
