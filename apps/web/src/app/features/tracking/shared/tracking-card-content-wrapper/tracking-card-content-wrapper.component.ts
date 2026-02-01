import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsEnum, UserType } from '@forma-ws/domain';
import { AlertService, AlertType } from '@forma-ws/frontend-shared';
import { TrackingService } from '../../services/tracking.service';
import { TrackingResourceService } from '../../services/resource/tracking-resource.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tracking-card-content-wrapper',
  imports: [CommonModule],
  templateUrl: './tracking-card-content-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingCardContentWrapperComponent {
  private readonly trackingService = inject(TrackingService);
  private readonly alertService = inject(AlertService);
  private readonly trackingResourceService = inject(TrackingResourceService);
  private readonly activatedRoute = inject(ActivatedRoute);

  permissionType = input.required<PermissionsEnum>();
  currentUser = input.required<UserType>();

  userType = UserType;

  removePermission() {
    const usedrId = this.activatedRoute.snapshot.paramMap.get('id');

    this.trackingResourceService
      .updatePermission(usedrId!, this.permissionType(), false)
      .subscribe({
        next: (data) => {
          this.alertService.show(
            AlertType.SUCCESS,
            'TRACKING.LOCKED.PERMISSION_DISABLED'
          );
        },
        error: (err) => {
          console.error('Error enabling permission:', err);
        },
        complete: () => {
          this.trackingService.reloadPermissions(usedrId!);
        },
      });
  }
}
