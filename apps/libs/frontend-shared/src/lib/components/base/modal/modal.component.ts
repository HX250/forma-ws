import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';

export type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  title = input<string>('');
  showCloseButton = input<boolean>(true);
  buttonText = input<string>('Open');
  size = input<ModalSize>('md');

  showFooterButtons = input<boolean>(true);
  primaryButtonText = input<string>('Submit');
  secondaryButtonText = input<string>('Cancel');

  primaryClick = output<void>();
  secondaryClick = output<void>();
  modalClosed = output<void>();

  isOpen = signal<boolean>(false);

  get sizeClass(): string {
    const sizes = {
      sm: 'max-w-[448px]',
      md: 'max-w-[672px]',
      lg: 'max-w-[896px]',
    };
    return sizes[this.size()];
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.modalClosed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onPrimaryClick(): void {
    this.primaryClick.emit();
    this.close();
  }

  onSecondaryClick(): void {
    this.secondaryClick.emit();
    this.close();
  }
}
