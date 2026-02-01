import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  ButtonComponent,
  ButtonProperties,
  EnumTranslator,
} from '@forma-ws/frontend-shared';
import { WeighInComponent } from './components/weigh-in.component';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';

@Component({
  selector: 'app-fitness-info',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonComponent,
    LoadingComponent,
    EnumLabelPipe,
  ],
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
  ButtonProperties = ButtonProperties;

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
        title: 'CLIENT_PROFILE.MODALS.WEIGH_IN_TITLE',
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
