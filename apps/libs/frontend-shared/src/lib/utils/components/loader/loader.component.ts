import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'forma-loading',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      @if (message()) {
      <p class="loading-message">{{ message() | translate }}</p>
      }
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 200px;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-message {
        margin-top: 16px;
        color: var(--text-secondary, #666);
        font-size: 14px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  message = input<string>('');
}
