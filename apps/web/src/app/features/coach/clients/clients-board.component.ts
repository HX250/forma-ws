import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { ClientsTableComponent } from './components/table/clients-table.component';
import { ClientTableView } from './components/table/models/client-table.model';
import { ClientTableService } from './components/table/services/client-table.service';

@Component({
  selector: 'app-clients-board',
  imports: [
    CommonModule,
    TranslateModule,
    ClientRegisterComponent,
    ClientsTableComponent,
  ],
  templateUrl: './clients-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsBoardComponent {
  private readonly clientTableService = inject(ClientTableService);

  reloadClients(): void {
    this.clientTableService.loadClientsTable(true);
  }

  onClientClick(event: { data: ClientTableView; index: number }): void {
    this.clientTableService.loadClientsTable(true);
  }
}
