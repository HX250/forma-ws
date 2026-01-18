import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'enumLabel',
  pure: false,
})
export class EnumLabelPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform<T extends Record<string, string | number>>(
    value: T[keyof T] | T[keyof T][],
    translationPrefix: string
  ): string {
    if (Array.isArray(value)) {
      return value
        .map((v) => this.translate.instant(`${translationPrefix}.${v}`))
        .filter(Boolean)
        .join(', ');
    }

    return this.translate.instant(`${translationPrefix}.${value}`);
  }
}
