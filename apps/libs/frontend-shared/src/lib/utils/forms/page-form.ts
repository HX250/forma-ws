import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { FormaFormContainer } from '@forma-ws/frontend-shared';

@Directive()
export class PageFormComponent<TFormGroup extends FormGroup<any>> {
  form!: FormaFormContainer<TFormGroup>;

  constructor() {}

  get loading() {
    return this.form.formLoader();
  }

  sendRequest(req: Observable<any>) {
    this.form.showLoader();

    req = req.pipe(
      finalize(() => {
        this.form.hideLoader();
      })
    );

    return req;
  }
}

/** TU SPRAVIT METODY KTORE BUDE POUZIVAT KAZDY JEDEN FORM, PUZIVAT SIGNALY!!!!! */
