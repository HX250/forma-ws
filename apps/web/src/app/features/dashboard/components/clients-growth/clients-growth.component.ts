import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { LineChartComponent } from '@forma-ws/frontend-shared';
import { ClientsGrowthService } from './services/clients-growth.service';

@Component({
  selector: 'app-clients-growth',
  imports: [CommonModule, TranslateModule, LineChartComponent],
  templateUrl: './clients-growth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsGrowthComponent {
  private clientsGrowthService = inject(ClientsGrowthService);

  chartConfig = this.clientsGrowthService.getChartConfig();
}
