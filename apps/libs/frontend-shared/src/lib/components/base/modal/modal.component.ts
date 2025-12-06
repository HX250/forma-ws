import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  title = '';
  showCloseButton = true;
  size: 'sm' | 'md' | 'lg' = 'md';
  showFooterButtons = true;
  primaryButtonText = 'Submit';
  secondaryButtonText = 'Cancel';

  closeModal = output<void>();
  primaryClick = output<void>();
  secondaryClick = output<void>();

  get sizeClass(): string {
    const sizes = {
      sm: 'max-w-[448px]',
      md: 'max-w-[672px]',
      lg: 'max-w-[896px]',
    };
    return sizes[this.size];
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close();
  }

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onPrimaryClick(): void {
    this.primaryClick.emit();
  }

  onSecondaryClick(): void {
    this.secondaryClick.emit();
  }
}
