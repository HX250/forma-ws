import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  ActionMenuComponent,
  AlertService,
  AlertType,
  ModalService,
} from '@forma-ws/frontend-shared';
import { EditClientGoalComponent } from '../client-goals/edit-client-goals.component';
import { TrackingService } from '../../../../tracking/services/tracking.service';
import { TranslateModule } from '@ngx-translate/core';
import { ClientActionsResourceService } from './resources/client-actions.resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-actions',
  standalone: true,
  imports: [CommonModule, ActionMenuComponent, TranslateModule],
  templateUrl: './client-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientActionsResourceService],
})
export class ClientActionsComponent {
  private readonly modalService = inject(ModalService);
  private readonly trackingService = inject(TrackingService);
  private readonly clientActionsResource = inject(ClientActionsResourceService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  clientId = input.required<string>();

  clientGoals = computed(() => this.trackingService.clientTrackingGoals());

  onSetClientGoals(): void {
    this.modalService
      .open<boolean>(EditClientGoalComponent, {
        title: 'CLIENT_PROFILE.MODALS.EDIT_GOALS_TITLE',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
        data: {
          clientId: this.clientId(),
          currentGoal: this.clientGoals(),
        },
      })
      .subscribe((result) => {
        if (result) {
          this.trackingService.loadClientGoals(this.clientId());
        }
      });
  }

  onDeleteClient(): void {
    this.clientActionsResource.deleteClient(this.clientId()).subscribe({
      next: () => {
        this.alertService.show(
          AlertType.SUCCESS,
          'CLIENT_PROFILE.CLIENT_ACTIONS.DELETE_SUCCESS'
        );
        this.router.navigate(['/clients']);
      },
      error: () => {
        this.alertService.show(
          AlertType.ERROR,
          'CLIENT_PROFILE.CLIENT_ACTIONS.DELETE_ERROR'
        );
      },
    });
  }
}
