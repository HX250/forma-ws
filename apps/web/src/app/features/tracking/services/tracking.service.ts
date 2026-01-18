import { inject, Injectable, signal } from '@angular/core';
import { ClientPermissions, ClientGoalResponse } from '@forma-ws/domain';
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
  clientTrackingGoals = signal<ClientGoalResponse>({} as ClientGoalResponse);
  loading = signal(false);

  loadPermissions(clientId: string) {
    LoaderUtils.sendRequest(
      this.clientsProfileResourceService.getClientPermissions(clientId),
      this.loading
    ).subscribe((permissions) => {
      this.clientsTrackingPermissions.set(permissions);
    });
  }

  loadClientGoals(clientId: string) {
    LoaderUtils.sendRequest(
      this.clientsProfileResourceService.getClientGoals(clientId),
      this.loading
    ).subscribe((goals) => {
      this.clientTrackingGoals.set(goals);
    });
  }

  reloadPermissions(clientId: string) {
    this.loadPermissions(clientId);
  }
}
