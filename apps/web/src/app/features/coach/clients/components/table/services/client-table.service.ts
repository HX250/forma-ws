import { inject, Injectable, signal } from '@angular/core';
import { ClientResourceService } from '../../../resources/clients.resource.service';
import { ClientTable } from '@forma-ws/domain';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';

@Injectable({
  providedIn: 'root',
})
export class ClientTableService {
  private readonly clientsResourceService = inject(ClientResourceService);
  private readonly securityService = inject(SecurityService);
  clientsTable = signal<ClientTable[] | null>(null);
  loading = signal<boolean>(false);

  loadClientsTable(reload = false): void {
    if (this.clientsTable() && !reload) {
      return;
    }

    this.loading.set(true);

    this.clientsResourceService
      .getClientList(this.securityService.userId()!)
      .subscribe({
        next: (clients) => {
          this.clientsTable.set(clients);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
