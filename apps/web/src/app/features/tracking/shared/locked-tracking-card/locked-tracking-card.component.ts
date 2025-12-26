import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionsEnum, UserType } from '@forma-ws/domain';
import { TrackingResourceService } from '../../services/resource/tracking-resource.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService, AlertType } from '@forma-ws/frontend-shared';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-locked-tracking-card',
  imports: [CommonModule, TranslateModule],
  templateUrl: './locked-tracking-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockedTrackingCardComponent {
  private readonly trackingResourceService = inject(TrackingResourceService);
  private readonly trackingService = inject(TrackingService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly alertService = inject(AlertService);

  title = input.required<string>();
  permissionType = input.required<PermissionsEnum>();
  currentUser = input.required<UserType>();

  icon = '🔒';
  message = 'Contact your coach to enable this feature';

  UserType = UserType;
  AlertType = AlertType;

  enablePermission() {
    const usedrId = this.activatedRoute.snapshot.paramMap.get('id');

    this.trackingResourceService
      .updatePermission(usedrId!, this.permissionType(), true)
      .subscribe({
        next: (data) => {
          this.alertService.show(
            AlertType.SUCCESS,
            'Permission enabled successfully'
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
