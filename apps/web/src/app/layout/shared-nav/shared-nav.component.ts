import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserFullNamePipe } from '@forma-ws/frontend-shared';

export interface NavLink {
  route: string;
  translationKey: string;
  exact?: boolean;
}

@Component({
  selector: 'app-shared-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, UserFullNamePipe],
  templateUrl: './shared-nav.component.html',
  styleUrls: ['./shared-nav.component.css'],
})
export class SharedNavComponent {
  @Input({ required: true }) navLinks: NavLink[] = [];
  @Input({ required: true }) isMobileMenuOpen: boolean = false;
  @Input({ required: true }) currentUser: any;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  onCloseMobileMenu() {
    this.closeMenu.emit();
  }

  onToggleMenu() {
    this.toggleMenu.emit();
  }

  onLogout() {
    this.logoutClick.emit();
  }
}
