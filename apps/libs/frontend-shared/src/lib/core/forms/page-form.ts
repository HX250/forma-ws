import { Directive } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { FormaFormContainer } from './forms';

@Directive()
export class PageFormComponent<TFormGroup extends FormGroup<any>> {
  form!: FormaFormContainer<TFormGroup>;

  constructor() {}

  get loading() {
    return this.form.formLoader();
  }

  sendFormRequest<T>(req: Observable<T>) {
    this.form.showLoader();

    req = req.pipe(
      finalize(() => {
        this.form.hideLoader();
      })
    );

    return req;
  }
}
