import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-theme-button',
  imports: [],
  standalone: true,
  template: `<button
    (click)="toggleTheme()"
    class="px-4 py-2 fixed bottom-6 right-6 rounded-full font-semibold bg-accent text-inverse dark:bg-accent-dark dark:text-inverse-dark shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-400"
  >
    X
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkLightButton {
  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }
}
