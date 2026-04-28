import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/guards/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="atm-bg"
   [style.backgroundImage]="'url(assets/ATM_MACHINE-IMG.jpg)'">>
      <div class="atm-card">
      <div class="atm-header">
          <img height="60px" src="./assets/self-service.png" />
          <div class="text">
            <h1>Create Account</h1>
            <p>Join ATM Simulation Banking</p>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <!-- Name -->
          <div class="field">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="Your full name" />
            <span class="err" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              Name is required
            </span>
          </div>

          <!-- Email -->
          <div class="field">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="you@example.com" />
            <span class="err" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Valid email required
            </span>
          </div>

          <!-- Role Dropdown -->
          <div class="field">
            <label>Role</label>
            <select formControlName="role">
              <option value="">Select Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <span class="err" *ngIf="form.get('role')?.invalid && form.get('role')?.touched">
              Role is required
            </span>
          </div>

          <!-- Phone -->
          <div class="field">
            <label>Phone Number</label>
            <input type="text" formControlName="phone" placeholder="10-digit phone number" />
          </div>

          <!-- Password -->
          <div class="field">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Min 6 characters" />
            <span class="err" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Min 6 characters
            </span>
          </div>

          <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>

          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="footer-link">
          Already have an account? <a routerLink="/auth/login">Login here</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .atm-bg { min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:linear-gradient(135deg,#0f2027,#203a43,#2c5364); font-family:'Segoe UI',sans-serif; }

    .atm-card {  border-radius:16px; padding:0px; width:100%; max-width:420px;
      box-shadow:0 20px 60px rgba(0,0,0,0.4); }

    .atm-header {
        display: flex;
        align-items: center;
        gap: 15px;
        padding:10px;
        margin-left:50px
      }

      .atm-header img {
        display: block;
      }

      .atm-header .text h1,
      .atm-header .text p {
        margin: 0;
        color:#fff
      }

    .field { margin-bottom:18px; }

    label { display:block; font-size:15px; font-weight:600; color:#fff; margin-bottom:2px; }

    input, select {
      width:100%;
      padding:11px 14px;
      border:2px solid #e0e0e0;
      border-radius:8px;
      font-size:15px;
      box-sizing:border-box;
      transition:border 0.2s;
      outline:none;
    }

    input:focus, select:focus { border-color:#2c5364; }

    .err { color:#e74c3c; font-size:12px; margin-top:4px; display:block; }

    .error-msg { background:#fdecea; color:#c0392b; padding:10px 14px;
      border-radius:8px; font-size:13px; margin-bottom:14px; }

    .btn-primary {
      width:100%;
      padding:14px;
      background:linear-gradient(135deg,#203a43,#2c5364);
      color:#fff;
      border:none;
      border-radius:8px;
      font-size:16px;
      font-weight:600;
      cursor:pointer;
    }

    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }

    .footer-link { text-align:center; margin-top:6px; font-size:14px; color:#fff; }

    .footer-link a { color:#fff; font-weight:600; text-decoration:none; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],  
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  errorMsg = '';

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const payload = this.form.value; // ✅ role included automatically

    console.log('Payload:', payload); // debug

    this.auth.register(payload as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed';
      }
    });
  }
}