import {
  ChangeDetectionStrategy,
  Component,
  output,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@forma-ws/frontend-shared';
import { Client } from '../../models/clients-table.model';
import { ClientsService } from '../../services/clients.service';
import { TableModel } from '@forma-ws/frontend-shared';
import { ClientResourceService } from '../../resources/clients.resource.service';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './clients-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsTableComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly clientsResourceService = inject(ClientResourceService);
  private readonly securityService = inject(SecurityService);

  protected clients = this.clientsService.clients;

  clientClick = output<{ data: Client; index: number }>();

  protected readonly tableModel: TableModel = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
  };

  protected onRowClick(event: { data: Client; index: number }): void {
    this.clientClick.emit(event);
  }

  ngOnInit(): void {
    this.clientsResourceService
      .getClientList(this.securityService.userId()!)
      .subscribe((clients) => {
        console.log(clients);
      });
  }
}
