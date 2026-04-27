import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserAtmService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-user-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="atm-page">
      <div class="atm-card">
        <div class="atm-card-header deposit-header">
          <div class="header-icon">💰</div>
          <h2>Cash Deposit</h2>
          <p>Add money to your account</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style="padding-bottom:8px">
          <div class="field">
            <label>Select Account</label>
            <select formControlName="accountId">
              <option value="">-- Select Account --</option>
              <option *ngFor="let a of accounts" [value]="a._id">
                {{ a.accountNumber }} ({{ a.accountType | titlecase }}) — ₹{{ a.balance | number }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>Amount (₹)</label>
            <input type="number" formControlName="amount" placeholder="Enter deposit amount" min="1" />
          </div>
          <div class="quick-amounts">
            <button type="button" *ngFor="let amt of quickAmounts" class="quick-btn" (click)="setAmount(amt)">₹{{ amt | number }}</button>
          </div>
          <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
          <button type="submit" class="btn-action deposit-btn" [disabled]="loading">
            {{ loading ? 'Processing...' : '💰 Deposit Cash' }}
          </button>
        </form>
        <div class="receipt" *ngIf="receipt">
          <h4>✅ Deposit Successful!</h4>
          <div class="receipt-row"><span>Reference</span><span>{{ receipt.reference }}</span></div>
          <div class="receipt-row"><span>Amount Deposited</span><span>{{ receipt.amount | currency:'INR':'symbol':'1.0-0' }}</span></div>
          <div class="receipt-row"><span>New Balance</span><strong>{{ receipt.newBalance | currency:'INR':'symbol':'1.0-0' }}</strong></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .atm-page { max-width:520px; margin-left:180px}
    .atm-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.1); overflow:hidden; }
    .atm-card-header { padding:24px 28px; color:#fff; }
    .deposit-header { background:linear-gradient(135deg,#27ae60,#1e8449); }
    .header-icon { font-size:40px; margin-bottom:8px; }
    h2 { margin:0 0 4px; font-size:22px; }
    p { margin:0; opacity:0.85; font-size:13px; }
    .field { padding:16px 28px 0; }
    label { display:block; font-size:13px; font-weight:600; color:#555; margin-bottom:6px; }
    input, select { width:100%; padding:12px 14px; border:2px solid #e0e0e0; border-radius:8px; font-size:15px; box-sizing:border-box; }
    input:focus, select:focus { border-color:#27ae60; outline:none; }
    .quick-amounts { display:flex; flex-wrap:wrap; gap:8px; padding:14px 28px 0; }
    .quick-btn { padding:8px 14px; background:#f0fff4; color:#27ae60; border:1px solid #27ae60; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
    .quick-btn:hover { background:#27ae60; color:#fff; }
    .msg { margin:12px 28px 0; padding:10px 14px; border-radius:8px; font-size:13px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .btn-action { display:block; width:calc(100% - 56px); margin:16px 28px 12px; padding:14px; border:none; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer; color:#fff; }
    .deposit-btn { background:linear-gradient(135deg,#27ae60,#1e8449); }
    .deposit-btn:disabled { opacity:0.6; cursor:not-allowed; }
    .receipt { margin:0 28px 24px; padding:16px; background:#f0fff4; border:1px solid #27ae60; border-radius:12px; }
    .receipt h4 { margin:0 0 12px; color:#1e8449; font-size:15px; }
    .receipt-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #c8e6d4; font-size:14px; color:#333; }
    .receipt-row:last-child { border-bottom:none; }
  `]
})
export class UserDepositComponent implements OnInit {
  private svc = inject(UserAtmService);
  private fb = inject(FormBuilder);
  accounts: any[] = [];
  loading = false;
  errorMsg = '';
  successMsg = '';
  receipt: any = null;
  quickAmounts = [500, 1000, 2000, 5000, 10000, 50000];

  form = this.fb.group({
    accountId: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]]
  });

  ngOnInit() { this.svc.getMyAccounts().subscribe(r => this.accounts = r.accounts); }
  setAmount(amt: number) { this.form.patchValue({ amount: amt as any }); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.successMsg = ''; this.receipt = null;
    const data = { accountId: this.form.value.accountId, amount: +this.form.value.amount! };
    this.svc.deposit(data).subscribe({
      next: (r) => {
        this.loading = false;
        this.successMsg = r.message;
        this.receipt = { reference: r.transaction.reference, amount: data.amount, newBalance: r.newBalance };
        this.form.reset();
      },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Deposit failed'; }
    });
  }
}
