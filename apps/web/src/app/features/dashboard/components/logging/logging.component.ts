import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import {
  DashboardCommon,
  DashboardCommonComponent,
  UserFullNamePipe,
} from '@forma-ws/frontend-shared';
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
  ],
  templateUrl: './logging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoggingResourceService],
})
export class LoggingComponent extends DashboardCommon<LoggingDto[]> {
  private loggingResourceService = inject(LoggingResourceService);

  loggingActivity = computed(() => this.dashBoardData() ?? []);

  override getData(): Observable<LoggingDto[]> {
    return this.loggingResourceService.getLoggingActivity();
  }
}
