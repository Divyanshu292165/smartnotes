import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Create Account</h2>
        <p>Join SmartNotes today and never lose a thought.</p>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label>Username</label>
            <input type="text" name="username" [(ngModel)]="username" required minlength="3" placeholder="Choose a username">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" [(ngModel)]="email" required placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" [(ngModel)]="password" required minlength="6" placeholder="Create a password (min 6 chars)">
          </div>
          
          <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
          
          <button type="submit" [disabled]="!registerForm.valid || isLoading" class="btn-primary">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>
        
        <div class="auth-links">
          Already have an account? <a routerLink="/login">Log in here</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--bg-color);
      padding: 1rem;
    }
    .auth-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 20px var(--shadow-color);
      border: 1px solid var(--border-color);
    }
    h2 {
      margin-top: 0;
      color: var(--text-color);
      font-weight: 700;
    }
    p {
      color: var(--text-light);
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-color);
      font-weight: 500;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: var(--bg-color);
      color: var(--text-color);
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
    .btn-primary {
      width: 100%;
      padding: 0.8rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      transition: opacity 0.2s;
    }
    .btn-primary:active {
      transform: translateY(1px);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .error-msg {
      color: #e53e3e;
      background: #fed7d7;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      border: 1px solid #feb2b2;
    }
    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.95rem;
      color: var(--text-light);
    }
    .auth-links a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .auth-links a:hover {
      text-decoration: underline;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create account. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
