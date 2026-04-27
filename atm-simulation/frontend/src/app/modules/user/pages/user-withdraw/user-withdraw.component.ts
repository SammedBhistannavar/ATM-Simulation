import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserAtmService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-user-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="atm-page">
      <div class="atm-card">
        <div class="atm-card-header withdraw-header">
          <div class="header-icon">💸</div>
          <h2>Cash Withdrawal</h2>
          <p>Multiples of ₹100 only</p>
        </div>

        <div *ngIf="!pinVerified">
          <h3>Step 1: Select Account & Enter PIN</h3>
          <form [formGroup]="pinForm" (ngSubmit)="verifyPin()">
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
              <label>4-Digit PIN</label>
              <input type="password" formControlName="pin" maxlength="4" placeholder="Enter PIN" />
            </div>
            <div class="msg error" *ngIf="pinError">{{ pinError }}</div>
            <button type="submit" class="btn-action withdraw-btn" [disabled]="pinLoading">
              {{ pinLoading ? 'Verifying...' : '🔓 Verify PIN' }}
            </button>
          </form>
        </div>

        <div *ngIf="pinVerified">
          <div class="balance-chip">
            Available Balance: <strong>{{ selectedAccount?.balance | currency:'INR':'symbol':'1.0-0' }}</strong>
          </div>
          <h3>Step 2: Enter Withdrawal Amount</h3>
          <div class="quick-amounts">
            <button *ngFor="let amt of quickAmounts" class="quick-btn" (click)="setAmount(amt)">₹{{ amt | number }}</button>
          </div>
          <form [formGroup]="withdrawForm" (ngSubmit)="withdraw()">
            <div class="field">
              <label>Amount (₹)</label>
              <input type="number" formControlName="amount" placeholder="Enter amount" step="100" min="100" />
            </div>
            <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
            <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
            <button type="submit" class="btn-action withdraw-btn" [disabled]="loading">
              {{ loading ? 'Processing...' : '💸 Withdraw Cash' }}
            </button>
            <button type="button" class="btn-reset" (click)="reset()">← Start Over</button>
          </form>
          <div class="receipt" *ngIf="receipt">
            <h4>✅ Transaction Successful</h4>
            <div class="receipt-row"><span>Reference</span><span>{{ receipt.reference }}</span></div>
            <div class="receipt-row"><span>Amount Withdrawn</span><span>{{ receipt.amount | currency:'INR':'symbol':'1.0-0' }}</span></div>
            <div class="receipt-row"><span>New Balance</span><span>{{ receipt.newBalance | currency:'INR':'symbol':'1.0-0' }}</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .atm-page { max-width:560px;margin-left:180px }
    .atm-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.1); overflow:hidden; }
    .atm-card-header { padding:24px 28px; color:#fff; }
    .withdraw-header { background:linear-gradient(135deg,#e74c3c,#c0392b); }
    .header-icon { font-size:40px; margin-bottom:8px; }
    h2 { margin:0 0 4px; font-size:22px; }
    p { margin:0; opacity:0.85; font-size:13px; }
    h3 { font-size:16px; font-weight:600; color:#333; margin:0 0 14px; padding:0 28px; }
    .balance-chip { margin:16px 28px 12px; padding:10px 16px; background:#f0f9f4; border:1px solid #27ae60;
      border-radius:8px; font-size:14px; color:#1e8449; }
    .field { padding:0 28px; margin-bottom:16px; }
    label { display:block; font-size:13px; font-weight:600; color:#555; margin-bottom:6px; }
    input, select { width:100%; padding:12px 14px; border:2px solid #e0e0e0; border-radius:8px;
      font-size:15px; box-sizing:border-box; }
    input:focus, select:focus { border-color:#e74c3c; outline:none; }
    .msg { margin:0 28px 12px; padding:10px 14px; border-radius:8px; font-size:13px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .quick-amounts { display:flex; flex-wrap:wrap; gap:8px; padding:0 28px; margin-bottom:16px; }
    .quick-btn { padding:8px 16px; background:#fdecea; color:#c0392b; border:1px solid #e74c3c;
      border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; }
    .quick-btn:hover { background:#e74c3c; color:#fff; }
    .btn-action { display:block; width:calc(100% - 56px); margin:0 28px 10px; padding:14px;
      border:none; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer; color:#fff; }
    .withdraw-btn { background:linear-gradient(135deg,#e74c3c,#c0392b); }
    .withdraw-btn:disabled { opacity:0.6; cursor:not-allowed; }
    .btn-reset { display:block; width:calc(100% - 56px); margin:0 28px 20px; padding:10px;
      border:1px solid #ddd; border-radius:8px; background:transparent; color:#888; cursor:pointer; font-size:14px; }
    .receipt { margin:16px 28px 24px; padding:16px; background:#f8fff8; border:1px solid #27ae60; border-radius:12px; }
    .receipt h4 { margin:0 0 12px; color:#1e8449; font-size:15px; }
    .receipt-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e0f0e0; font-size:14px; color:#333; }
    .receipt-row:last-child { border-bottom:none; font-weight:700; }
    form { padding-bottom:8px; }
  `]
})
export class UserWithdrawComponent implements OnInit {
  private svc = inject(UserAtmService);
  private fb = inject(FormBuilder);
  accounts: any[] = [];
  selectedAccount: any = null;
  pinVerified = false;
  pinLoading = false;
  loading = false;
  pinError = '';
  errorMsg = '';
  successMsg = '';
  receipt: any = null;
  quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  pinForm = this.fb.group({ accountId: ['', Validators.required], pin: ['', [Validators.required, Validators.minLength(4)]] });
  withdrawForm = this.fb.group({ amount: ['', [Validators.required, Validators.min(100)]] });

  ngOnInit() { this.svc.getMyAccounts().subscribe(r => this.accounts = r.accounts); }

  verifyPin() {
    if (this.pinForm.invalid) return;
    this.pinLoading = true; this.pinError = '';
    const { accountId, pin } = this.pinForm.value;
    this.svc.verifyPin({ accountId, pin }).subscribe({
      next: (r) => { this.pinLoading = false; this.pinVerified = true; this.selectedAccount = r.account; },
      error: err => { this.pinLoading = false; this.pinError = err.error?.message || 'PIN verification failed'; }
    });
  }

  setAmount(amt: number) { this.withdrawForm.patchValue({ amount: amt as any }); }

  withdraw() {
    if (this.withdrawForm.invalid) return;
    this.loading = true; this.errorMsg = ''; this.successMsg = ''; this.receipt = null;
    const data = { accountId: this.pinForm.value.accountId, amount: +this.withdrawForm.value.amount! };
    this.svc.withdraw(data).subscribe({
      next: (r) => {
        this.loading = false;
        this.successMsg = r.message;
        this.receipt = { reference: r.transaction.reference, amount: data.amount, newBalance: r.newBalance };
        this.selectedAccount = { ...this.selectedAccount, balance: r.newBalance };
        this.withdrawForm.reset();
      },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Withdrawal failed'; }
    });
  }

  reset() { this.pinVerified = false; this.selectedAccount = null; this.receipt = null; this.pinForm.reset(); this.withdrawForm.reset(); this.pinError = ''; this.errorMsg = ''; }
}
