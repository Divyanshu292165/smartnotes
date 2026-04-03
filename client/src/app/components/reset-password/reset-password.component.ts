import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Reset Password</h1>
          <p class="auth-subtitle">Enter your new password below.</p>
        </div>

        @if (successMessage) {
          <div class="success-box">
            <span>✅</span> {{ successMessage }}
          </div>
          <a routerLink="/login" class="btn-submit" style="text-decoration:none; text-align:center; margin-top:1rem; display:block;">Go to Login</a>
        }

        @if (!successMessage) {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label>New Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Min 6 characters"
                required
                minlength="6"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                required
                class="form-input"
              />
            </div>

            @if (errorMessage) {
              <div class="error-box">{{ errorMessage }}</div>
            }

            <button type="submit" class="btn-submit" [disabled]="isLoading || !password || !confirmPassword">
              @if (isLoading) {
                <span class="spinner"></span> Resetting...
              } @else {
                Set New Password
              }
            </button>
          </form>
        }
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
    }
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
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirmPassword = '';
  token = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'Invalid reset link. Please request a new one.';
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.cdr.detectChanges();
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Reset failed. The link may have expired.';
        this.cdr.detectChanges();
      }
    });
  }
}
