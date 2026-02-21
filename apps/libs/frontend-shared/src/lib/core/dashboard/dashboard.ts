import { Directive, OnDestroy, OnInit, signal } from '@angular/core';
import {
  catchError,
  EMPTY,
  finalize,
  Observable,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';

@Directive()
export abstract class DashboardCommon<T> implements OnInit, OnDestroy {
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);
  dashBoardData = signal<T | null>(null);

  private destroy$ = new Subject<void>();

  get loading() {
    return this.isLoading();
  }

  ngOnInit(): void {
    this.getDashBoardData(this.getData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDashBoardData(req: Observable<T>) {
    this.isLoading.set(true);
    this.isError.set(false);

    req
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.isError.set(true);
          this.dashBoardData.set(null);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.dashBoardData.set(data ?? null);
        },
      });
  }

  abstract getData(): Observable<T>;
}
