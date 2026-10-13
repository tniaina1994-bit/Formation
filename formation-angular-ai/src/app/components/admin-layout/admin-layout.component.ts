import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;

  logout(): void {
    this.authService.logout();
  }

  getUserFullName(): string {
    const u = this.user();
    if (!u) return '';
    return `${u.firstname} ${u.lastname}`;
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return '';
    return `${u.firstname.charAt(0)}${u.lastname.charAt(0)}`.toUpperCase();
  }
}
