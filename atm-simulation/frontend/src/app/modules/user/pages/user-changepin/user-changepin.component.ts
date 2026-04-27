import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserAtmService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-user-changepin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="atm-page">
      <div class="atm-card">
        <div class="atm-card-header pin-header">
          <div class="header-icon">🔐</div>
          <h2>Change PIN</h2>
          <p>Update your account PIN securely</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style="padding-bottom:16px">
          <div class="field">
            <label>Select Account</label>
            <select formControlName="accountId">
              <option value="">-- Select Account --</option>
              <option *ngFor="let a of accounts" [value]="a._id">{{ a.accountNumber }} ({{ a.accountType | titlecase }})</option>
            </select>
          </div>
          <div class="field">
            <label>Current PIN</label>
            <input type="password" formControlName="currentPin" maxlength="4" placeholder="Enter current 4-digit PIN" />
          </div>
          <div class="field">
            <label>New PIN</label>
            <input type="password" formControlName="newPin" maxlength="4" placeholder="Enter new 4-digit PIN" />
          </div>
          <div class="field">
            <label>Confirm New PIN</label>
            <input type="password" formControlName="confirmPin" maxlength="4" placeholder="Re-enter new PIN" />
            <span class="err" *ngIf="form.errors?.['pinMismatch'] && form.get('confirmPin')?.touched">PINs do not match</span>
          </div>
          <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
          <button type="submit" class="btn-action pin-btn" [disabled]="loading">
            {{ loading ? 'Updating...' : '🔐 Update PIN' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .atm-page { max-width:480px; margin-left:180px}
    .atm-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.1); overflow:hidden; }
    .atm-card-header { padding:24px 28px; color:#fff; }
    .pin-header { background:linear-gradient(135deg,#9b59b6,#8e44ad); }
    .header-icon { font-size:40px; margin-bottom:8px; }
    h2 { margin:0 0 4px; font-size:22px; }
    p { margin:0; opacity:0.85; font-size:13px; }
    .field { padding:14px 28px 0; }
    label { display:block; font-size:13px; font-weight:600; color:#555; margin-bottom:6px; }
    input, select { width:100%; padding:12px 14px; border:2px solid #e0e0e0; border-radius:8px; font-size:15px; box-sizing:border-box; }
    input:focus, select:focus { border-color:#9b59b6; outline:none; }
    .err { color:#c0392b; font-size:12px; margin-top:4px; display:block; }
    .msg { margin:12px 28px 0; padding:10px 14px; border-radius:8px; font-size:13px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .btn-action { display:block; width:calc(100% - 56px); margin:16px 28px 0; padding:14px; border:none; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer; color:#fff; }
    .pin-btn { background:linear-gradient(135deg,#9b59b6,#8e44ad); }
    .pin-btn:disabled { opacity:0.6; cursor:not-allowed; }
  `]
})
export class UserChangePinComponent implements OnInit {
  private svc = inject(UserAtmService);
  private fb = inject(FormBuilder);
  accounts: any[] = [];
  loading = false;
  errorMsg = '';
  successMsg = '';

  form = this.fb.group({
    accountId: ['', Validators.required],
    currentPin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    newPin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    confirmPin: ['', Validators.required]
  }, { validators: (g: any) => g.get('newPin')?.value === g.get('confirmPin')?.value ? null : { pinMismatch: true } });

  ngOnInit() { this.svc.getMyAccounts().subscribe(r => this.accounts = r.accounts); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.successMsg = '';
    const { accountId, currentPin, newPin } = this.form.value;
    this.svc.changePin({ accountId, currentPin, newPin }).subscribe({
      next: () => { this.loading = false; this.successMsg = 'PIN changed successfully!'; this.form.reset(); },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Failed to change PIN'; }
    });
  }
}
