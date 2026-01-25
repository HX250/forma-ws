import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ClientsProfileResourceService } from '../../../resources/clients-profile.resources.service';
import {
  ClientFitnessDetails,
  ClientGeneralGoalResponse,
  GoalType,
  UserType,
} from '@forma-ws/domain';
import {
  EnumLabelPipe,
  LoaderUtils,
  LoadingComponent,
  ModalService,
} from '@forma-ws/frontend-shared';
import { WeighInComponent } from './components/weigh-in.component';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';

@Component({
  selector: 'app-fitness-info',
  imports: [CommonModule, TranslateModule, LoadingComponent, EnumLabelPipe],
  templateUrl: './fitness-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitnessInfoComponent {
  private readonly clientsProfileResourceService = inject(
    ClientsProfileResourceService
  );
  private readonly securityService = inject(SecurityService);
  private modalService = inject(ModalService);

  clientId = input.required<string>();
  clientGoals = input.required<ClientGeneralGoalResponse>();

  clientFitnessData = signal<ClientFitnessDetails>({} as ClientFitnessDetails);
  loading = signal(true);

  user = this.securityService.userType();

  UserType = UserType;
  GoalType = GoalType;

  private clientIdEffect = effect(() => {
    this.loadFitnessData();
  });

  loadFitnessData() {
    LoaderUtils.sendRequest(
      this.clientsProfileResourceService.getClientFitnessDetails(
        this.clientId()!
      ),
      this.loading
    ).subscribe((data) => {
      this.clientFitnessData.set(data);
    });
  }

  async openWeighInModal(): Promise<void> {
    this.modalService
      .open<boolean>(WeighInComponent, {
        title: '💪 Weigh-In',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
        data: {
          clientId: this.clientId,
        },
      })
      .subscribe((result) => {
        if (result) {
          this.loadFitnessData();
        }
      });
  }
}
