import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardResourceService } from './resources/dashboard.resource.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  newPassword: string = '';

  constructor(private dashboardService: DashboardResourceService) {}

  submitNewPassword() {
    this.dashboardService
      .setClientPassword(this.newPassword)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
