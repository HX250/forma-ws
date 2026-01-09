import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../components/language-switcher/language.service';

@Pipe({
  name: 'languageSwitcher',
  standalone: true,
  pure: false,
})
export class LanguageSwitcherPipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(nameEn: string, nameSk: string): string {
    return this.languageService.currentLang() === 'en' ? nameEn : nameSk;
  }
}
