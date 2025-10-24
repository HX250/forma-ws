import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@forma-ws/frontend-shared';
import { AlertType } from 'apps/libs/frontend-shared/src/lib/utils/components/alert/alert.model';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {}

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
            console.log(res.body);
          }
        },
        error: (err) => {
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
