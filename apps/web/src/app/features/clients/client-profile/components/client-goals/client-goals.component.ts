import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-goals',
  imports: [CommonModule],
  templateUrl: './client-goals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientGoalsComponent {
  clientId = input.required<string>();
}
