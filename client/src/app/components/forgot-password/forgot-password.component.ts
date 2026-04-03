import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Forgot Password</h1>
          <p class="auth-subtitle">Enter your email and we'll send you a reset link.</p>
        </div>

        @if (successMessage) {
          <div class="success-box">
            <span>✅</span> {{ successMessage }}
          </div>
        }

        @if (!successMessage) {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="you{'@'}example.com"
                required
                class="form-input"
                autocomplete="email"
              />
            </div>

            @if (errorMessage) {
              <div class="error-box">{{ errorMessage }}</div>
            }

            <button type="submit" class="btn-submit" [disabled]="isLoading || !email.trim()">
              @if (isLoading) {
                <span class="spinner"></span> Sending...
              } @else {
                Send Reset Link
              }
            </button>
          </form>
        }

        <p class="auth-switch">
          Remember your password? <a routerLink="/login">Log in here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: #f0f4ff;
    }
    .auth-card {
      background: #fff;
      border-radius: 20px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 8px 32px rgba(102,126,234,0.10);
    }
    .auth-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }
    .auth-subtitle {
      color: #64748b;
      margin: 0.5rem 0 0;
      font-size: 0.95rem;
    }
    .auth-header { margin-bottom: 2rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group label {
      font-size: 0.8rem; font-weight: 600; color: #475569;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .form-input {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: inherit;
      transition: all 0.2s ease;
      background: #f8fafc;
      color: #334155;
    }
    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
    }
    .btn-submit {
      padding: 0.8rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      background: linear-gradient(135deg, #667eea, #764ba2);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) {
      box-shadow: 0 4px 16px rgba(102,126,234,0.4);
      transform: translateY(-1px);
    }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .error-box {
      padding: 0.75rem 1rem;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 10px;
      color: #dc2626;
      font-size: 0.9rem;
      text-align: center;
    }
    .success-box {
      padding: 1rem;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 10px;
      color: #16a34a;
      font-size: 0.95rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    .auth-switch {
      text-align: center;
      margin-top: 1.5rem;
      color: #64748b;
      font-size: 0.9rem;
    }
    .auth-switch a { color: #667eea; font-weight: 600; }
    .spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
