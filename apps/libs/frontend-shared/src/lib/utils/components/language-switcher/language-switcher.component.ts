import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <button
      class="fixed bottom-6 left-6 px-4 py-2 rounded-full font-semibold bg-accent text-inverse dark:bg-accent-dark dark:text-inverse-dark shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-400"
      (click)="onChange(current)"
    >
      {{ current.toUpperCase() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);

  current = '';

  constructor() {
    const saved = localStorage.getItem('app.lang');

    if (saved) {
      this.current = saved;
      this.translate.use(saved);
      return;
    }

    this.translate.setFallbackLang('en');
    this.current = this.translate.getFallbackLang() || 'en';
  }

  onChange(lang: string) {
    const newLang = lang === 'en' ? 'sk' : 'en';
    this.translate.use(newLang);
    this.current = newLang;
    localStorage.setItem('app.lang', newLang);
  }
}
