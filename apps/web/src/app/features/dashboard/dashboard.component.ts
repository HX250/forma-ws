import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardResourceService } from './resources/dashboard.resource.service';
import { AlertService, AlertType } from '@forma-ws/frontend-shared';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  newPassword: string = '';

  private alertService = inject(AlertService);
  private dashboardService = inject(DashboardResourceService);

  submitNewPassword() {
    this.dashboardService
      .setClientPassword(this.newPassword)
      .subscribe((res) => {});
  }

  showSuccessAlert() {
    this.alertService.show(
      AlertType.SUCCESS,
      'This is a success message. Everything went well!',
      'Success'
    );
  }

  showErrorAlert() {
    this.alertService.show(
      AlertType.ERROR,
      'This is an error message. Something went wrong!',
      'Error'
    );
  }

  showWarningAlert() {
    this.alertService.show(
      AlertType.WARNING,
      'This is a warning message. Please be careful!',
      'Warning'
    );
  }

  showInfoAlert() {
    this.alertService.show(
      AlertType.INFO,
      'This is an info message. Here is some useful information.',
      'Information'
    );
  }
}
