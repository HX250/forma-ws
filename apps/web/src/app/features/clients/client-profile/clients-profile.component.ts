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
import { UserType } from '@forma-ws/domain';

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
  selectedDate = signal<Date>(new Date());
  memberSince = signal<Date | null>(null);
  today = signal<Date>(new Date());
  UserType = UserType;

  ngOnInit(): void {
    this.clientId.set(this.getClientId());
  }

  onDateChange(value: string) {
    this.selectedDate.set(new Date(value));
  }

  previousDay() {
    const currentDate = this.selectedDate();
    const previousDate = new Date(currentDate);

    previousDate.setDate(previousDate.getDate() - 1);

    const minDate = new Date(this.memberSince() || '');

    if (minDate && previousDate < minDate) {
      return;
    }

    this.selectedDate.set(previousDate);
  }

  nextDay() {
    const currentDate = this.selectedDate();
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const maxDate = this.today();
    if (nextDate > maxDate) {
      return;
    }

    this.selectedDate.set(nextDate);
  }

  goToToday() {
    this.selectedDate.set(new Date());
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
