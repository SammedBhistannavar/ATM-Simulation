import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/guards/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
   <div class="atm-bg" [style.backgroundImage]="'url(assets/ATM_MACHINE-IMG.jpg)'">

    <div class="atm-right">
      <div class="atm-card">

        <div class="atm-header">
          <img height="70px" src="./assets/self-service.png" />
          <h1>Reset Password</h1>
          <p>Enter your email and New password</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <!-- EMAIL -->
          <div class="field">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="Enter your email" />
            <span class="err"
              *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Valid email required
            </span>
          </div>

          <!-- NEW PASSWORD -->
          <div class="field">
            <label>New Password</label>
            <input type="password" formControlName="password" placeholder="Enter new password" />
            <span class="err"
              *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Minimum 6 characters required
            </span>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="field">
            <label>Confirm Password</label>
            <input type="password" formControlName="confirmPassword" placeholder="Confirm password" />
            <span class="err"
              *ngIf="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched">
              Confirm password required
            </span>
          </div>

          <!-- SUCCESS / ERROR -->
          <div class="success-msg" *ngIf="successMsg">
            {{ successMsg }}
          </div>

          <div class="error-msg" *ngIf="errorMsg">
            {{ errorMsg }}
          </div>

          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>

        </form>

        <div class="footer-link">
          <a routerLink="/auth/login">Back to Login</a>
        </div>

      </div>
    </div>

  </div>
  `,
  styles: [`
    .atm-bg {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: cover;
      background-position: center;
      font-family: 'Segoe UI', sans-serif;
    }

    .atm-right {
      width: 100%;
      max-width: 500px;
      display: flex;
      justify-content: center;
    }

    .atm-card {
      border-radius: 16px;
      padding: 20px;
      width: 100%;
      max-width: 420px;
    }

    .atm-header {
      text-align: center;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      color: #ededed;
    }

    p {
      margin-top: 6px;
      color: #ededed;
      font-size: 14px;
    }

    .field {
      margin-bottom: 16px;
    }

    label {
      color: #ededed;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 6px;
      display: block;
    }

    input {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 2px solid #ddd;
      outline: none;
    }

    .err {
      color: #e74c3c;
      font-size: 12px;
    }

    .success-msg {
      background: #eafaf1;
      color: #27ae60;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 13px;
    }

    .error-msg {
      background: #fdecea;
      color: #c0392b;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 13px;
    }

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg,#203a43,#2c5364);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size:15px;
      font-weight:600;
      cursor: pointer;
    }

    .footer-link {
      text-align: center;
      margin-top: 16px;
      color: #ededed;
    }

    .footer-link a {
      color: #ededed;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class ForgotPasswordComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  loading = false;
  successMsg = '';
  errorMsg = '';

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    // ⚠️ This API must:
    // 1. Check email exists
    // 2. Update password securely
    this.auth.forgotPassword(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Password updated successfully';

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Something went wrong';
      }
    });
  }
}