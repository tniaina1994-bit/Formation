import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: (tokenResponse) => {
        this.authService.fetchCurrentUser().subscribe({
          next: (user) => {
            this.authService.setAuth(tokenResponse.access_token, user);
            this.router.navigate(['/admin/dashboard']);
          },
          error: (err) => {
            this.errorMessage = err.error?.detail || 'Impossible de récupérer le profil utilisateur';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Email ou mot de passe incorrect';
        this.isLoading = false;
      }
    });
  }
}
