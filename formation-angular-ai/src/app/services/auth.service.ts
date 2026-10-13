import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8081';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  user = signal<User | null>(this.getUserFromStorage());
  token = signal<string | null>(this.getTokenFromStorage());

  isAuthenticated = computed(() => this.token() !== null);
  isAdmin = computed(() => this.user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    });

    return this.http.post<{ access_token: string; token_type: string }>(
      `${this.apiUrl}/auth/login`,
      body.toString(),
      { headers }
    );
  }

  fetchCurrentUser() {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  setAuth(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.token.set(token);
    this.user.set(user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getTokenFromStorage(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}
