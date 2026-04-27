import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserAtmService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-user-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="atm-page">
      <div class="atm-card">
        <div class="atm-card-header transfer-header">
          <div class="header-icon">🔄</div>
          <h2>Fund Transfer</h2>
          <p>Transfer money to any account</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style="padding-bottom:8px">
          <div class="field">
            <label>From Account</label>
            <select formControlName="fromAccountId">
              <option value="">-- Select Your Account --</option>
              <option *ngFor="let a of accounts" [value]="a._id">
                {{ a.accountNumber }} — ₹{{ a.balance | number }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>Enter PIN</label>
            <input type="password" formControlName="pin" maxlength="4" placeholder="4-digit PIN" />
          </div>
          <div class="field">
            <label>To Account Number</label>
            <input type="text" formControlName="toAccountNumber" placeholder="Destination account number" />
          </div>
          <div class="field">
            <label>Amount (₹)</label>
            <input type="number" formControlName="amount" placeholder="Amount to transfer" min="1" />
          </div>
          <div class="field">
            <label>Description (Optional)</label>
            <input type="text" formControlName="description" placeholder="e.g. Rent payment" />
          </div>
          <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
          <button type="submit" class="btn-action transfer-btn" [disabled]="loading">
            {{ loading ? 'Processing...' : '🔄 Transfer Funds' }}
          </button>
        </form>
        <div class="receipt" *ngIf="receipt">
          <h4>✅ Transfer Successful!</h4>
          <div class="receipt-row"><span>Amount Sent</span><span>{{ receipt.amount | currency:'INR':'symbol':'1.0-0' }}</span></div>
          <div class="receipt-row"><span>To Account</span><span>{{ receipt.toAccount }}</span></div>
          <div class="receipt-row"><span>New Balance</span><strong>{{ receipt.newBalance | currency:'INR':'symbol':'1.0-0' }}</strong></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .atm-page { max-width:520px;margin-left:180px }
    .atm-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.1); overflow:hidden; }
    .atm-card-header { padding:24px 28px; color:#fff; }
    .transfer-header { background:linear-gradient(135deg,#3498db,#2980b9); }
    .header-icon { font-size:40px; margin-bottom:8px; }
    h2 { margin:0 0 4px; font-size:22px; }
    p { margin:0; opacity:0.85; font-size:13px; }
    .field { padding:14px 28px 0; }
    label { display:block; font-size:13px; font-weight:600; color:#555; margin-bottom:6px; }
    input, select { width:100%; padding:12px 14px; border:2px solid #e0e0e0; border-radius:8px; font-size:15px; box-sizing:border-box; }
    input:focus, select:focus { border-color:#3498db; outline:none; }
    .msg { margin:12px 28px 0; padding:10px 14px; border-radius:8px; font-size:13px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .btn-action { display:block; width:calc(100% - 56px); margin:16px 28px 12px; padding:14px; border:none; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer; color:#fff; }
    .transfer-btn { background:linear-gradient(135deg,#3498db,#2980b9); }
    .transfer-btn:disabled { opacity:0.6; cursor:not-allowed; }
    .receipt { margin:0 28px 24px; padding:16px; background:#eaf4fb; border:1px solid #3498db; border-radius:12px; }
    .receipt h4 { margin:0 0 12px; color:#1a5276; font-size:15px; }
    .receipt-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #cce0f0; font-size:14px; color:#333; }
    .receipt-row:last-child { border-bottom:none; }
  `]
})
export class UserTransferComponent implements OnInit {
  private svc = inject(UserAtmService);
  private fb = inject(FormBuilder);
  accounts: any[] = [];
  loading = false;
  errorMsg = '';
  successMsg = '';
  receipt: any = null;

  form = this.fb.group({
    fromAccountId: ['', Validators.required],
    pin: ['', [Validators.required, Validators.minLength(4)]],
    toAccountNumber: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]],
    description: ['']
  });

  ngOnInit() { this.svc.getMyAccounts().subscribe(r => this.accounts = r.accounts); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.successMsg = ''; this.receipt = null;
    const { fromAccountId, pin, toAccountNumber, amount, description } = this.form.value;

    // Verify PIN first, then transfer
    this.svc.verifyPin({ accountId: fromAccountId, pin }).subscribe({
      next: () => {
        this.svc.transfer({ fromAccountId, toAccountNumber, amount: +amount!, description }).subscribe({
          next: (r) => {
            this.loading = false;
            this.successMsg = r.message;
            this.receipt = { amount: +amount!, toAccount: toAccountNumber, newBalance: r.newBalance };
            this.form.reset();
          },
          error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Transfer failed'; }
        });
      },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Invalid PIN'; }
    });
  }
}
