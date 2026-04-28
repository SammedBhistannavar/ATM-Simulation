import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/guards/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="atm-bg"
   [style.backgroundImage]="'url(assets/ATM_MACHINE-IMG.jpg)'">>

  <!-- RIGHT LOGIN -->
  <div class="atm-right">
    <div class="atm-card">
      <div class="atm-header">
        <img height="50px" src="./assets/self-service.png" />
        <h1>ATM Simulation</h1>
        <p>Secure Banking Portal</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label>Email Address</label>
          <input type="email" formControlName="email" placeholder="Enter your email" />
          <span class="err" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
            Valid email required
          </span>
        </div>

        <div class="field">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="Enter your password" />
          <span class="err" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
            Password required
          </span>
        </div>

        <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

        <button type="submit" [disabled]="loading" class="btn-primary">
          {{ loading ? 'Authenticating...' : 'Login' }}
        </button>
      </form>

      <div class="footer-link">
        New user? <a routerLink="/auth/register">Register here</a>
      </div>
      <div class="forgot-link">
        <a (click)="goToForgot()" >Forgot Password?</a>
      </div>
    </div>
  </div>

</div>
  `,
  styles: [`
.atm-bg {
  min-height: 100vh;
  display: flex;
  justify-content: center;   /* ✅ center horizontally */
  align-items: center;       /* ✅ center vertically */
  background-size: cover;
  background-position: center;
  font-family: 'Segoe UI', sans-serif;
}

/* RIGHT SIDE CONTAINER */
.atm-right {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  padding-right: 40px;
}

/* CARD */
.atm-card {
  border-radius: 16px;
  padding: 5px;
  width: 100%;
  justify-content:center;
  max-width: 420px;
}
  

    .atm-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .atm-logo {
      font-size: 56px;
      margin-bottom: 8px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      color: #ededed;
      font-weight: 700;
    }

    p {
      margin: 4px 0 0;
      color: #ededef;;
      font-size: 14px;
    }

    .field {
      margin-bottom: 18px;
    }

    label {
      display: block;
      font-size: 15px;
      font-weight: 600;
      color:  #ededef;;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      box-sizing: border-box;
      transition: border 0.2s;
      outline: none;
    }

    input:focus {
      border-color: #2c5364;
    }

    .err {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    .error-msg {
      background: #fdecea;
      color: #c0392b;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 14px;
    }

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg,#203a43,#2c5364);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
    }

    .footer-link {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color:  #ededef;;
    }

    .footer-link a {
      color:  #ededef;;
      font-weight: 600;
      text-decoration: none;
    }
    
    .forgot-link{
     text-align: center; 
     margin-top: 16px; 
      color:  #ededef;;
        font-weight: 600;
        text-decoration: none;
      cursor: pointer;
    }
    /* RESPONSIVE */
    @media (max-width: 768px) {
      .atm-left {
        display: none;
      }

      .atm-right {
        flex: 1 100%;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  errorMsg = '';

  goToForgot() {
  this.router.navigate(['/auth/forgot-password']);
}

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.form.value as any).subscribe({
      next: res => {
        this.loading = false;
        this.auth.redirectByRole(res.user.role);
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Login failed';
      }
    });
  }
}