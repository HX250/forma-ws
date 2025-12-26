import { WritableSignal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

export class LoaderUtils {
  static sendRequest<T>(req: Observable<T>, loader: WritableSignal<boolean>) {
    loader.set(true);
    req = req.pipe(
      finalize(() => {
        loader.set(false);
      })
    );
    return req;
  }
}
