import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService } from './alert.service';
import { AlertType } from './alert.model';

@Component({
  selector: 'app-alert',
  imports: [CommonModule, TranslateModule],
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-[70] flex flex-col gap-3 max-w-md">
      @for (alert of alertService.alerts(); track alert.id) {
      <div
        [class]="getAlertClasses(alert.type)"
        class="rounded-lg p-4 flex items-start gap-3 animate-slide-in"
      >
        <div
          [class]="getIconClasses(alert.type)"
          class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            @switch (alert.type) { @case ('success') {
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
            } @case ('error') {
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
            } @case ('warning') {
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
            } @case ('info') {
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
            } }
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h4
            class="font-semibold text-sm mb-1"
            [class]="getTextClasses(alert.type)"
          >
            {{ alert.header || getDefaultHeader(alert.type) | translate }}
          </h4>
          <p class="text-sm" [class]="getTextClasses(alert.type)">
            {{ alert.text | translate }}
          </p>
        </div>

        <button
          (click)="alertService.remove(alert.id)"
          [class]="getTextClasses(alert.type)"
          class="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  alertService = inject(AlertService);

  getAlertClasses(type: AlertType): string {
    const typeClasses = {
      success:
        'bg-primary dark:bg-primary-dark border-2 border-accent/30 dark:border-accent-dark/30',
      error: 'bg-primary dark:bg-primary-dark border-2 border-utils-error/30',
      warning:
        'bg-primary dark:bg-primary-dark border-2 border-utils-warning/30',
      info: 'bg-primary dark:bg-primary-dark border-2 border-utils-info/30',
    };
    return `${typeClasses[type]}`;
  }

  getIconClasses(type: AlertType): string {
    const typeClasses = {
      success:
        'bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark',
      error: 'bg-utils-error/20 text-utils-error',
      warning: 'bg-utils-warning/20 text-utils-warning',
      info: 'bg-utils-info/20 text-utils-info',
    };
    return typeClasses[type];
  }

  getTextClasses(type: AlertType): string {
    const typeClasses = {
      success: 'text-secondary dark:text-secondary-dark',
      error: 'text-secondary dark:text-secondary-dark',
      warning: 'text-secondary dark:text-secondary-dark',
      info: 'text-secondary dark:text-secondary-dark',
    };
    return typeClasses[type];
  }

  getDefaultHeader(type: AlertType): string {
    const headers = {
      success: 'ALERT.SUCCESS',
      error: 'ALERT.ERROR',
      warning: 'ALERT.WARNING',
      info: 'ALERT.INFO',
    };
    return headers[type];
  }
}
