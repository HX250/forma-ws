import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ClientsProfileResourceService } from '../../../resources/clients-profile.resources.service';
import { ClientGeneralDetails } from '@forma-ws/domain';
import { UserFullNamePipe } from '../../../../../../../../libs/frontend-shared/src/lib/utils/pipes/user-full-name.pipe';
import { LoaderUtils, LoadingComponent } from '@forma-ws/frontend-shared';

@Component({
  selector: 'app-general-info',
  imports: [CommonModule, TranslateModule, UserFullNamePipe, LoadingComponent],
  templateUrl: './general-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  private readonly clientsProfileResourceService = inject(
    ClientsProfileResourceService
  );

  clientId = input<string | null>(null);
  memberSince = output<Date>();

  clientGeneralData = signal<ClientGeneralDetails>({} as ClientGeneralDetails);
  loading = signal(true);

  private clientIdEffect = effect(() => {
    LoaderUtils.sendRequest(
      this.clientsProfileResourceService.getClientDetails(this.clientId()!),
      this.loading
    ).subscribe((data) => {
      this.clientGeneralData.set(data);
      this.memberSince.emit(data.createdAt);
    });
  });
}
