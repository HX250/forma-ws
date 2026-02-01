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
import { ButtonComponent, ModalService } from '@forma-ws/frontend-shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-board',
  imports: [
    CommonModule,
    TranslateModule,
    ClientsTableComponent,
    ButtonComponent,
  ],
  templateUrl: './clients-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsBoardComponent {
  private readonly clientTableService = inject(ClientTableService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  openRegisterModal(): void {
    this.modalService
      .open<boolean>(ClientRegisterComponent, {
        title: 'REGISTER_CLIENT.TITLE',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
      })
      .subscribe((result) => {
        if (result) {
          this.reloadClients();
        }
      });
  }

  reloadClients(): void {
    this.clientTableService.loadClientsTable(true);
  }

  onClientClick(event: { data: ClientTableView; index: number }): void {
    this.router.navigate(['/clients/profile', event.data.id]);
  }
}
