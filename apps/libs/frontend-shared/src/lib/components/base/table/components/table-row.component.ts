import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'forma-table-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowComponent<T = unknown> {
  data = input.required<T>();
  index = input<number>(0);
  columnCount = input<number>(5);

  rowClick = output<{ data: T; index: number }>();

  protected isHovered = signal<boolean>(false);

  @HostBinding('class')
  get hostClasses(): string {
    return 'grid cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent-dark hover:bg-accent/5 dark:hover:bg-accent-dark/5  last:rounded-b-lg overflow-hidden';
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return 0;
  }

  @HostBinding('attr.role')
  get role(): string {
    return 'button';
  }

  @HostBinding('style.grid-template-columns')
  get gridTemplateColumns(): string {
    const count = this.columnCount();
    return `repeat(${count}, 1fr)`;
  }

  @HostListener('click')
  onClick(): void {
    this.rowClick.emit({ data: this.data(), index: this.index() });
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space', ['$event'])
  onKeyPress(event?: Event): void {
    event?.preventDefault();
    this.rowClick.emit({ data: this.data(), index: this.index() });
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered.set(false);
  }
}
