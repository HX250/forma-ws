import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonProperties } from './buttonProperties.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<ButtonProperties.ButtonVariant>(
    ButtonProperties.ButtonVariant.PRIMARY
  );
  size = input<ButtonProperties.ButtonSize>(ButtonProperties.ButtonSize.MEDIUM);
  type = input<ButtonProperties.ButtonType>(ButtonProperties.ButtonType.BUTTON);
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
      'w-full',
      'rounded-md',
      'font-bold',
      'transition-colors',
      'duration-150',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-accent',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-offset-primary',
      'dark:focus-visible:ring-offset-primary-dark',
      'cursor-pointer',
    ];

    const size = this.size();
    if (size === 'sm') base.push('h-9', 'px-3', 'text-sm');
    else if (size === 'lg') base.push('h-11', 'px-5', 'text-base');
    else base.push('h-10', 'px-4', 'text-sm');

    const variant = this.variant();
    if (variant === 'secondary') {
      base.push(
        'bg-secondary',
        'text-primary',
        'border',
        'border-secondary',
        'hover:bg-muted',
        'dark:bg-secondary-dark',
        'dark:text-primary-dark',
        'dark:border-secondary-dark',
        'dark:hover:bg-muted-dark'
      );
    } else {
      base.push(
        'bg-accent',
        'text-primary',
        'hover:bg-accent/80',
        'active:bg-accent/80',
        'shadow-sm',
        'hover:shadow-md',
        'dark:bg-accent-dark',
        'dark:text-primary-dark',
        'dark:shadow-none',
        'dark:hover:bg-accent-dark/80'
      );
    }

    if (this.disabled() || this.loading()) {
      base.push('cursor-not-allowed');
      if (variant === 'secondary') {
        base.push(
          'bg-muted',
          'text-muted',
          'border-secondary',
          'dark:bg-muted-dark',
          'dark:text-muted-dark',
          'dark:border-secondary-dark'
        );
      } else {
        base.push(
          'bg-accent/60',
          'text-primary/90',
          'shadow-none',
          'hover:bg-accent/60',
          'dark:bg-accent-dark/60',
          'dark:text-primary-dark/90'
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
