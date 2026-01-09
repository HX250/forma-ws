import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);

  currentLang = signal<string>('en');
  private supportedLanguages = ['en', 'sk'];

  currentLangEffect = effect(() => {
    const lang = this.currentLang();

    if (!this.supportedLanguages.includes(lang)) {
      return;
    }
    this.translate.use(lang);
  });

  constructor() {
    const saved = localStorage.getItem('app.lang');

    if (saved) {
      this.currentLang.set(saved);
      this.translate.use(saved);
      return;
    }

    this.translate.setFallbackLang('en');
    this.currentLang.set(this.translate.getFallbackLang() || 'en');
  }

  onChange(lang: string) {
    const newLang = lang === 'en' ? 'sk' : 'en';
    this.currentLang.set(newLang);
    localStorage.setItem('app.lang', newLang);
  }
}
