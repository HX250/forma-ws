import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockedTrackingCardComponent } from '../locked-tracking-card/locked-tracking-card.component';
import { PermissionsEnum, UserType } from '@forma-ws/domain';
import { TrackingCardContentWrapperComponent } from '../tracking-card-content-wrapper/tracking-card-content-wrapper.component';

@Component({
  selector: 'app-tracking-card-wrapper',
  imports: [
    CommonModule,
    LockedTrackingCardComponent,
    TrackingCardContentWrapperComponent,
  ],
  templateUrl: './tracking-card-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingCardWrapperComponent {
  isEnabled = input.required<boolean>();
  title = input.required<string>();
  currentUser = input.required<UserType>();
  permissionType = input.required<PermissionsEnum>();
  lockedIcon = input<string>('🔒');
  lockedMessage = input<string>('Contact your coach to enable this feature');

  UserType = UserType;
}
