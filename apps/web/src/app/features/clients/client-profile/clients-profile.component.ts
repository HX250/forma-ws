import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsProfileResourceService } from '../resources/clients-profile.resources.service';

@Component({
  selector: 'app-clients-board',
  imports: [CommonModule, TranslateModule],
  templateUrl: './clients-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsProfileComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly injector = inject(Injector);
  private readonly clientsProfileResourceService = inject(
    ClientsProfileResourceService
  );
  clientId = signal<string | null>(null);

  private clientIdEffect = effect(() => {
    this.clientsProfileResourceService
      .getClientDetails(this.clientId()!)
      .subscribe((data) => {
        console.log(data);
      });
    this.clientsProfileResourceService
      .getClientHealthDetails(this.clientId()!)
      .subscribe((data) => {
        console.log(data);
      });
    this.clientsProfileResourceService
      .getClientPermissions(this.clientId()!)
      .subscribe((data) => {
        console.log(data);
      });
  });

  ngOnInit(): void {
    this.clientId.set(this.activatedRoute.snapshot.paramMap.get('id'));
  }
}
