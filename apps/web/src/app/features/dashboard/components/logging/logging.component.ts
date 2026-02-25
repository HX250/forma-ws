import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonComponent,
  ButtonProperties,
  DashboardCommon,
  DashboardCommonComponent,
  UserFullNamePipe,
} from '@forma-ws/frontend-shared';
import { interval, Subject, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { LoggingResourceService } from './resources/logging.resource.service';
import { LoggingDto } from '@forma-ws/domain';

@Component({
  selector: 'app-logging',
  imports: [
    CommonModule,
    TranslateModule,
    DashboardCommonComponent,
    UserFullNamePipe,
    DatePipe,
    ButtonComponent,
  ],
  templateUrl: './logging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoggingResourceService],
})
export class LoggingComponent
  extends DashboardCommon<LoggingDto[]>
  implements OnInit, OnDestroy
{
  private loggingResourceService = inject(LoggingResourceService);
  protected des$ = new Subject<void>();

  ButtonProperties = ButtonProperties;
  loggingActivity = computed(() => this.dashBoardData() ?? []);

  override ngOnInit(): void {
    super.ngOnInit();
    interval(60_000)
      .pipe(takeUntil(this.des$))
      .subscribe(() => this.getDashBoardData(this.getData()));
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.des$.next();
    this.des$.complete();
  }

  refresh(): void {
    this.getDashBoardData(this.getData());
  }

  override getData(): Observable<LoggingDto[]> {
    return this.loggingResourceService.getLoggingActivity();
  }
}
