import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface BreadcrumbItem {
  label: string;
  step: number;
  route?: string;
  validity?: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  items = input.required<BreadcrumbItem[]>();
  currentStep = input.required<number>();
  stepValidity = input<Record<number, boolean>>({});

  stepClick = output<number>();

  private completedSteps = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      const current = this.currentStep();
      const validity = this.stepValidity();
      const completed = new Set(this.completedSteps());

      const previousStep = current - 1;
      if (previousStep > 0 && validity[previousStep] === true) {
        completed.add(previousStep);
      }

      const updatedCompleted = new Set<number>();
      completed.forEach((step) => {
        if (validity[step] === true || validity[step] === undefined) {
          updatedCompleted.add(step);
        }
      });

      if (updatedCompleted.size !== this.completedSteps().size ||
          !Array.from(updatedCompleted).every(step => this.completedSteps().has(step))) {
        this.completedSteps.set(updatedCompleted);
      }
    });
  }

  isActive = (step: number): boolean => {
    return step === this.currentStep();
  };

  isCompleted = (step: number): boolean => {
    const completed = this.completedSteps();
    if (completed.size > 0) {
      return completed.has(step);
    }
    return step < this.currentStep();
  };

  isFirst = (step: number): boolean => {
    return step === 1;
  };

  getBreadcrumbClass = (step: number): string => {
    const base =
      'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors';
    if (this.isActive(step)) {
      return `${base} text-accent dark:text-accent-dark bg-accent/10 dark:bg-accent-dark/10`;
    } else if (this.isCompleted(step)) {
      return `${base} text-secondary dark:text-secondary-dark hover:text-accent dark:hover:text-accent-dark cursor-pointer`;
    } else {
      return `${base} text-muted dark:text-muted-dark cursor-pointer hover:text-secondary dark:hover:text-secondary-dark`;
    }
  };

  getStepNumberClass = (step: number): string => {
    const base = 'border-2';
    if (this.isActive(step)) {
      return `${base} border-accent dark:border-accent-dark bg-accent dark:bg-accent-dark text-primary dark:text-primary-dark`;
    } else {
      return `${base} border-secondary dark:border-secondary-dark text-secondary dark:text-secondary-dark`;
    }
  };

  onStepClick(step: number, event: Event): void {
    event.preventDefault();
    const current = this.currentStep();
    const validity = this.stepValidity();
    const completed = this.completedSteps();

    if (step > current && validity[current] === true) {
      const newCompleted = new Set(completed);
      newCompleted.add(current);
      this.completedSteps.set(newCompleted);
    }

    this.stepClick.emit(step);
  }
}
