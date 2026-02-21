import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { LoadingComponent } from '../../utils';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonProperties } from '../base';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-dashboard-common',
  imports: [CommonModule, LoadingComponent, ButtonComponent, TranslateModule],
  templateUrl: './dashboard-common.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCommonComponent {
  isLoading = input<boolean>(false);
  isError = input<boolean>(false);
  retry = output<void>();

  ButtonVariant = ButtonProperties.ButtonVariant;
}
