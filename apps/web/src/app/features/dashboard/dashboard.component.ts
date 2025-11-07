import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  expandedWidget = signal<string | null>(null);

  toggleWidget(widgetId: string) {
    if (this.expandedWidget() === widgetId) {
      this.expandedWidget.set(null);
    } else {
      this.expandedWidget.set(widgetId);
    }
  }

  isExpanded(widgetId: string): boolean {
    return this.expandedWidget() === widgetId;
  }

  isHidden(widgetId: string): boolean {
    const expanded = this.expandedWidget();
    return expanded !== null && expanded !== widgetId;
  }
}
