import { inject, Injectable, signal } from '@angular/core';
import { ClientPermissions } from '@forma-ws/domain';
import { LoaderUtils } from '@forma-ws/frontend-shared';
import { ClientsProfileResourceService } from '../../clients/resources/clients-profile.resources.service';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private readonly clientsProfileResourceService = inject(
    ClientsProfileResourceService
  );

  clientsTrackingPermissions = signal<ClientPermissions | null>(null);
  loading = signal(false);

  loadPermissions(clientId: string) {
    LoaderUtils.sendRequest(
      this.clientsProfileResourceService.getClientPermissions(clientId),
      this.loading
    ).subscribe((permissions) => {
      this.clientsTrackingPermissions.set(permissions);
    });
  }

  reloadPermissions(clientId: string) {
    this.loadPermissions(clientId);
  }
}
