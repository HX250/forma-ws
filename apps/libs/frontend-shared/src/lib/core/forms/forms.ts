import { signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface formLoader {
  formLoader: WritableSignal<boolean>;
  showLoader: () => void;
  hideLoader: () => void;
}

export interface FormBase {
  dirty: boolean;
}

export type FormaFormContainer<TFormaForm extends FormBase> = formLoader &
  TFormaForm;

export type FormaFormGroup<
  TControl extends { [K in keyof TControl]: AbstractControl<any> } = any
> = FormGroup<TControl> & formLoader;

export class FormUtils {
  static createFormGroup<T extends FormBase>(form: T) {
    if (!form) {
      throw new Error('Form is required');
    }

    FormUtils.createFormLoader(form);

    return form as unknown as FormaFormContainer<T>;
  }

  private static createFormLoader(form: object) {
    if (!form) {
      throw new Error('Form is required');
    }

    const formaForm = form as FormaFormGroup;
    formaForm.formLoader = signal<boolean>(false);

    formaForm.showLoader = () => {
      formaForm.formLoader.set(true);
    };

    formaForm.hideLoader = () => {
      formaForm.formLoader.set(false);
    };
  }
}
