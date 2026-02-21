import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientsGrowthComponent } from './components/clients-growth/clients-growth.component';
import { WeightTrendComponent } from './components/weight-trend/weight-trend.component';
import { LoggingComponent } from './components/logging/logging.component';
import { ClientEngagementComponent } from './components/client-engagement/client-engagement.component';
import { LoggingTimingComponent } from './components/logging-timing/logging-timing.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ClientsGrowthComponent,
    WeightTrendComponent,
    LoggingComponent,
    ClientEngagementComponent,
    LoggingTimingComponent,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
