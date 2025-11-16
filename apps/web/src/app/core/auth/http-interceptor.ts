import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AlertService, AlertType } from '@forma-ws/frontend-shared';
import { Observable, tap } from 'rxjs';
import { SecurityService } from './security.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptor implements HttpInterceptor {
  private alertService = inject(AlertService);
  private securityService = inject(SecurityService);
  private router = inject(Router);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let clonedReq = req.clone({
      withCredentials: true,
    });

    return next.handle(clonedReq).pipe(
      tap({
        next: (res) => {
          if (res instanceof HttpResponse) {
          }
        },
        error: (err) => {
          if (err.url?.includes('/auth/me')) {
            return;
          }

          if (err.status === 401) {
            this.securityService.clear();
            this.router.navigateByUrl('/');
          }
          this.errorHandling(err);
        },
      })
    );
  }

  errorHandling(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        this.alertService.show(AlertType.ERROR, 'ERRORS.BAD_REQUEST');
        break;
      case 401:
        this.alertService.show(AlertType.ERROR, 'ERRORS.UNATHORIZED');
        break;
      case 403:
        this.alertService.show(AlertType.ERROR, 'ERRORS.FORBIDDEN_ACCESS');
        break;
      case 404:
        this.alertService.show(AlertType.ERROR, 'ERRORS.RESOURCE_NOT_FOUND');
        break;
      case 500:
        this.alertService.show(AlertType.ERROR, 'ERRORS.INTERNAL_SERVER_ERROR');
        break;
      default:
        this.alertService.show(
          AlertType.ERROR,
          error.message || 'ERRORS.UNKNOWN_ERROR'
        );
        break;
    }
  }
}
