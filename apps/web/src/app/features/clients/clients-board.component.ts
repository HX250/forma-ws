import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { ClientsTableComponent } from './components/table/clients-table.component';
import { Client } from './models/clients-table.model';

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
  onClientClick(event: { data: Client; index: number }): void {
    console.log('Client clicked:', event);
    console.log('Client name:', event.data.name);
  }
}
