// client/src/app/components/header/header.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() darkMode = false;
  @Output() toggleDarkMode = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  onToggleDarkMode() {
    this.toggleDarkMode.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
