import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Flag } from 'lucide-angular';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    <button
      class="flex items-center justify-center w-12 h-12 fixed bottom-6 left-6 rounded-full bg-accent text-inverse dark:bg-accent-dark dark:text-inverse-dark shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
      (click)="onChange(current())"
      [attr.aria-label]="
        'Switch to ' + (current() === 'en' ? 'Slovak' : 'English')
      "
    >
      @if(current() === 'en') {
      <svg class="w-7 h-7" viewBox="0 0 30 30" fill="none">
        <defs>
          <clipPath id="circle-clip">
            <circle cx="15" cy="15" r="15" />
          </clipPath>
        </defs>
        <g clip-path="url(#circle-clip)">
          <rect width="30" height="30" fill="#012169" />
          <path d="M0 0 L30 30 M30 0 L0 30" stroke="white" stroke-width="3" />
          <path d="M0 0 L30 30 M30 0 L0 30" stroke="#C8102E" stroke-width="2" />
          <path d="M15 0 L15 30 M0 15 L30 15" stroke="white" stroke-width="5" />
          <path
            d="M15 0 L15 30 M0 15 L30 15"
            stroke="#C8102E"
            stroke-width="3"
          />
        </g>
        <circle
          cx="15"
          cy="15"
          r="14.5"
          fill="none"
          stroke="white"
          stroke-width="1"
          opacity="0.3"
        />
      </svg>
      } @else {
      <svg class="w-7 h-7" viewBox="0 0 30 30" fill="none">
        <defs>
          <clipPath id="circle-clip-sk">
            <circle cx="15" cy="15" r="15" />
          </clipPath>
        </defs>
        <g clip-path="url(#circle-clip-sk)">
          <rect width="30" height="10" fill="white" />
          <rect y="10" width="30" height="10" fill="#0B4EA2" />
          <rect y="20" width="30" height="10" fill="#EE1C25" />
          <g transform="translate(8, 10)">
            <path
              d="M0 0 L7 0 L7 8 L3.5 10 L0 8 Z"
              fill="#EE1C25"
              stroke="white"
              stroke-width="0.5"
            />
            <path
              d="M1.5 3 L5.5 3 M1.5 5 L5.5 5 M3.5 1.5 L3.5 7"
              stroke="white"
              stroke-width="0.7"
            />
          </g>
        </g>
        <circle
          cx="15"
          cy="15"
          r="14.5"
          fill="none"
          stroke="white"
          stroke-width="1"
          opacity="0.3"
        />
      </svg>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);

  readonly FlagIcon = Flag;
  current = signal('en');

  constructor() {
    const saved = localStorage.getItem('app.lang');

    if (saved) {
      this.current.set(saved);
      this.translate.use(saved);
      return;
    }

    this.translate.setFallbackLang('en');
    this.current.set(this.translate.getFallbackLang() || 'en');
  }

  onChange(lang: string) {
    const newLang = lang === 'en' ? 'sk' : 'en';
    this.translate.use(newLang);
    this.current.set(newLang);
    localStorage.setItem('app.lang', newLang);
  }
}
