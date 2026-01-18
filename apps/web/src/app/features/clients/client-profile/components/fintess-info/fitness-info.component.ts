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
import { ActivatedRoute } from '@angular/router';
import { ClientsProfileResourceService } from '../../../resources/clients-profile.resources.service';
import {
  ClientFitnessDetails,
  ClientGeneralGoalResponse,
  GoalType,
} from '@forma-ws/domain';
import {
  EnumLabelPipe,
  LoaderUtils,
  LoadingComponent,
} from '@forma-ws/frontend-shared';

@Component({
  selector: 'app-fitness-info',
  imports: [CommonModule, TranslateModule, LoadingComponent, EnumLabelPipe],
  templateUrl: './fitness-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitnessInfoComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly clientsProfileResourceService = inject(
    ClientsProfileResourceService
  );

  clientId = input.required<string>();
  clientGoals = input.required<ClientGeneralGoalResponse>();

  clientFitnessData = signal<ClientFitnessDetails>({} as ClientFitnessDetails);
  loading = signal(true);

  GoalType = GoalType;  

  private clientIdEffect = effect(() => {
    LoaderUtils.sendRequest(
      this.clientsProfileResourceService.getClientFitnessDetails(
        this.clientId()!
      ),
      this.loading
    ).subscribe((data) => {
      this.clientFitnessData.set(data);
    });
  });
}
