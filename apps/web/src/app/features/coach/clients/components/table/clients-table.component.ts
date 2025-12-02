import {
  ChangeDetectionStrategy,
  Component,
  output,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateUtils,
  LoadingComponent,
  TableComponent,
} from '@forma-ws/frontend-shared';
import { TableModel } from '@forma-ws/frontend-shared';
import { ClientTableView } from './models/client-table.model';
import { TranslateModule } from '@ngx-translate/core';
import { ClientTableService } from './services/client-table.service';
import { ClientTable } from '@forma-ws/domain';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, TableComponent, LoadingComponent, TranslateModule],
  templateUrl: './clients-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsTableComponent implements OnInit {
  private readonly clientTableService = inject(ClientTableService);

  clientsTable = computed(() =>
    (this.clientTableService.clientsTable() ?? []).map((client) =>
      this.mapClients(client)
    )
  );
  loading = computed(() => this.clientTableService.loading());
  clientClick = output<{ data: ClientTableView; index: number }>();

  protected readonly tableModel: TableModel = {
    fullName: 'CLIENTS_TABLE.FULL_NAME',
    canTrackExercise: 'CLIENTS_TABLE.EXCERCISE',
    canTrackSleep: 'CLIENTS_TABLE.SLEEP',
    canTrackNutrition: 'CLIENTS_TABLE.NUTRITION',
    canTrackWater: 'CLIENTS_TABLE.WATER',
    updatedAt: 'CLIENTS_TABLE.LAST_UPDATED',
  };

  protected onRowClick(event: { data: ClientTableView; index: number }): void {
    this.clientClick.emit(event);
  }

  ngOnInit(): void {
    this.clientTableService.loadClientsTable();
  }

  mapClients(client: ClientTable) {
    return {
      id: client.id,
      fullName: `${client.firstName} ${client.lastName}`.trim(),
      canTrackExercise: client.canTrackExercise,
      canTrackSleep: client.canTrackSleep,
      canTrackNutrition: client.canTrackNutrition,
      canTrackWater: client.canTrackWater,
      updatedAt: DateUtils.formatDateWithTime(client.updatedAt),
    };
  }
}
