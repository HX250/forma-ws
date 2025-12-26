import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { FitnessInfoComponent } from './components/fintess-info/fitness-info.component';
import { TrackingComponent } from '../../tracking/tracking.component';
import { ClientGoalsComponent } from './components/client-goals/client-goals.component';
import { FormsModule } from '@angular/forms';
import { SecurityService } from '../../../core/auth/security.service';
import { Client, Coach, UserType } from '@forma-ws/domain';

@Component({
  selector: 'app-clients-profile',
  imports: [
    CommonModule,
    TranslateModule,
    GeneralInfoComponent,
    FitnessInfoComponent,
    TrackingComponent,
    ClientGoalsComponent,
    FormsModule,
  ],
  templateUrl: './clients-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsProfileComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  clientId = signal<string>('');
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  UserType = UserType;

  ngOnInit(): void {
    this.clientId.set(this.getClientId());
  }

  redirectToClientList() {
    this.router.navigateByUrl('/clients');
  }

  private getClientId(): string {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id) {
      this.redirectToClientList();
      return '';
    }

    return id;
  }
}
