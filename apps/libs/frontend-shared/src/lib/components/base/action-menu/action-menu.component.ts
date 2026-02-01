import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  icon = input<string>('more_vert');
  position = input<'left' | 'right'>('right');
  disabled = input<boolean>(false);

  isOpen = signal(false);

  menuPositionClass = computed(() => {
    return this.position() === 'left' ? 'left-0' : 'right-0';
  });

  toggleMenu(): void {
    if (this.disabled()) return;
    this.isOpen.set(!this.isOpen());
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu-container')) {
      this.closeMenu();
    }
  }
}
