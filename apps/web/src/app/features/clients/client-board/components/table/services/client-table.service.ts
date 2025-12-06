import { inject, Injectable, signal } from '@angular/core';
import { ClientsBoardResourceService } from '../../../../resources/clients-board.resource.service';
import { ClientTable } from '@forma-ws/domain';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';

@Injectable({
  providedIn: 'root',
})
export class ClientTableService {
  private readonly clientsBoardResourceService = inject(
    ClientsBoardResourceService
  );
  private readonly securityService = inject(SecurityService);
  clientsTable = signal<ClientTable[] | null>(null);
  loading = signal<boolean>(false);

  loadClientsTable(reload = false): void {
    if (this.clientsTable() && !reload) {
      return;
    }

    this.loading.set(true);

    this.clientsBoardResourceService
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
