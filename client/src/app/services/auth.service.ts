// client/src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginData, RegisterData } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'smartnotes-token';
  
  // Expose current user as a signal for easy reactivity across components
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkStoredUser();
  }

  // --- Auth Checks ---
  checkStoredUser() {
    const token = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem('smartnotes-user');
    
    if (token && storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (err) {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // --- API Calls ---
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('smartnotes-user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // --- Private Helpers ---
  private handleAuthSuccess(res: AuthResponse) {
    if (res.token) {
      localStorage.setItem(this.tokenKey, res.token);
      
      const user: User = { _id: res._id, username: res.username, email: res.email };
      localStorage.setItem('smartnotes-user', JSON.stringify(user));
      
      this.currentUser.set(user);
    }
  }
}
