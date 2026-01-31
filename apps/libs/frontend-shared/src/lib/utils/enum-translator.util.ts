import { TranslateService } from '@ngx-translate/core';

export class EnumTranslator {
  static translate<T extends Record<string, string | number>>(
    translateService: TranslateService,
    value: T[keyof T] | T[keyof T][],
    translationPrefix: string
  ): string {
    if (Array.isArray(value)) {
      return value
        .map((v) => translateService.instant(`${translationPrefix}.${v}`))
        .filter(Boolean)
        .join(', ');
    }

    return translateService.instant(`${translationPrefix}.${value}`);
  }
}
