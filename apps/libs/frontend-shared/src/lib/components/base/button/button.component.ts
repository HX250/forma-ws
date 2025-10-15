import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<ButtonType>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string>('');
  text = input.required<string>();

  clicked = output<MouseEvent>();

  buttonClass = computed(() => {
    const base = [
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-lg',
      'font-medium',
      'transition-colors',
      'duration-150',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-accent-500',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-offset-bg-primary',
      'dark:focus-visible:ring-offset-bg-primary-dark',
      'cursor-pointer',
    ];

    const size = this.size();
    if (size === 'sm') base.push('h-9', 'px-3', 'text-sm');
    else if (size === 'lg') base.push('h-11', 'px-5', 'text-base');
    else base.push('h-10', 'px-4', 'text-sm');

    const variant = this.variant();
    if (variant === 'secondary') {
      base.push(
        'bg-neutral-950',
        'text-secondary',
        'border',
        'border-neutral-300',
        'hover:bg-bg-muted',
        'dark:bg-neutral-800',
        'dark:text-secondary-dark',
        'dark:border-neutral-700',
        'dark:hover:bg-bg-muted-dark'
      );
    } else {
      base.push(
        'bg-accent-600',
        'text-white',
        'hover:bg-accent-700',
        'active:bg-accent-700/90',
        'shadow-sm',
        'hover:shadow-md',
        'dark:shadow-none'
      );
    }

    if (this.disabled() || this.loading()) {
      base.push('cursor-not-allowed');
      if (variant === 'secondary') {
        base.push(
          'bg-bg-muted',
          'text-muted',
          'border-neutral-200',
          'dark:bg-neutral-800',
          'dark:text-muted-dark',
          'dark:border-neutral-700'
        );
      } else {
        base.push(
          'bg-accent-600/60',
          'text-white/90',
          'shadow-none',
          'hover:bg-accent-600/60'
        );
      }
    }

    if (this.loading()) base.push('cursor-wait', 'pointer-events-none');

    return base.join(' ');
  });

  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) return;
    this.clicked.emit(event);
  }
}
