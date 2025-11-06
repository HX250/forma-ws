import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface NavLink {
  route: string;
  translationKey: string;
  exact?: boolean;
}

@Component({
  selector: 'app-shared-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './shared-nav.component.html',
  styleUrls: ['./shared-nav.component.css'],
})
export class SharedNavComponent {
  navLinks = input.required<NavLink[]>();
  linkClick = output<void>();

  onLinkClick() {
    this.linkClick.emit();
  }
}
