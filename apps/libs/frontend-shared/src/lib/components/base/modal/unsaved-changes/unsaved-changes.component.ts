import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export type ModalSize = 'sm' | 'md' | 'lg';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './unsaved-changes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesModal {}
