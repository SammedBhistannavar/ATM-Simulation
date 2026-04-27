import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Bank Accounts</h2>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Open Account' }}</button>
      </div>

      <div class="form-card" *ngIf="showForm">
        <h3>Open New Bank Account</h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="field">
              <label>Select User</label>
              <select formControlName="userId">
                <option value="">-- Select User --</option>
                <option *ngFor="let u of users" [value]="u._id">{{ u.name }} ({{ u.email }})</option>
              </select>
            </div>
            <div class="field">
              <label>Account Type</label>
              <select formControlName="accountType">
                <option value="savings">Savings</option>
                <option value="current">Current</option>
                <option value="salary">Salary</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>Initial Balance (₹)</label>
              <input formControlName="initialBalance" type="number" min="0" placeholder="0" />
            </div>
            <div class="field">
              <label>Daily Withdrawal Limit (₹)</label>
              <input formControlName="dailyLimit" type="number" min="1000" placeholder="20000" />
            </div>
          </div>
          <div class="field pin-field">
            <label>4-Digit PIN</label>
            <input formControlName="pin" type="password" maxlength="4" placeholder="e.g. 1234" />
          </div>
          <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Opening...' : 'Open Account' }}</button>
        </form>
      </div>

      <!-- Daily Limit Editor -->
      <div class="form-card" *ngIf="limitEdit">
        <h3>Update Daily Limit for <span class="acc-no">{{ limitEdit.accountNumber }}</span></h3>
        <div class="form-row">
          <div class="field">
            <label>New Daily Limit (₹)</label>
            <input type="number" [value]="newLimit" (input)="newLimit = +$any($event.target).value" min="1000" />
          </div>
        </div>
        <button class="btn-primary" (click)="saveLimit()">Save Limit</button>
        <button class="btn-secondary" (click)="limitEdit = null">Cancel</button>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr><th>#</th><th>Account No.</th><th>Owner</th><th>Type</th><th>Balance</th><th>Daily Limit</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of accounts; let i = index">
              <td>{{ i+1 }}</td>
              <td><code>{{ a.accountNumber }}</code></td>
              <td>{{ a.userId?.name }}<br><small>{{ a.userId?.email }}</small></td>
              <td><span class="type-badge">{{ a.accountType | titlecase }}</span></td>
              <td class="amount">{{ a.balance | currency:'INR':'symbol':'1.0-0' }}</td>
              <td>{{ a.dailyLimit | currency:'INR':'symbol':'1.0-0' }}</td>
              <td><span [class]="'badge ' + (a.isActive ? 'active' : 'inactive')">{{ a.isActive ? 'Active' : 'Blocked' }}</span></td>
              <td>
                <button class="btn-sm" (click)="toggle(a)">{{ a.isActive ? '🔒 Block' : '✅ Activate' }}</button>
                <button class="btn-sm edit" (click)="editLimit(a)">✏️ Limit</button>
              </td>
            </tr>
            <tr *ngIf="!accounts.length"><td colspan="8" class="empty">No accounts found.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1200px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    h2 { margin:0; font-size:22px; font-weight:700; color:#1a1a2e; }
    .form-card { background:#fff; border-radius:12px; padding:24px; margin-bottom:20px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    h3 { margin:0 0 16px; font-size:16px; color:#333; }
    .acc-no { color:#3498db; font-family:monospace; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .field { margin-bottom:14px; }
    .pin-field { max-width:200px; }
    label { display:block; font-size:13px; font-weight:600; color:#555; margin-bottom:6px; }
    input, select { width:100%; padding:10px 12px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    input:focus, select:focus { border-color:#3498db; outline:none; }
    .msg { padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:12px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .btn-primary { padding:10px 20px; background:linear-gradient(135deg,#3498db,#2980b9); color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; margin-right:8px; }
    .btn-secondary { padding:10px 20px; background:#f0f4f8; color:#555; border:none; border-radius:8px; font-size:14px; cursor:pointer; }
    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; vertical-align:top; }
    small { color:#888; font-size:12px; }
    code { font-size:12px; background:#f0f4f8; padding:2px 6px; border-radius:4px; }
    .type-badge { padding:3px 10px; border-radius:12px; font-size:12px; background:#eaf4fb; color:#1a5276; font-weight:600; }
    .amount { font-weight:700; color:#1e8449; }
    .badge { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
    .active { background:#d5f5e3; color:#1e8449; }
    .inactive { background:#fdecea; color:#c0392b; }
    .btn-sm { padding:5px 10px; border:none; border-radius:6px; font-size:12px; cursor:pointer; background:#eaf4fb; color:#2980b9; margin-right:4px; font-weight:500; }
    .btn-sm.edit { background:#fef9e7; color:#7d6608; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class AdminAccountsComponent implements OnInit {
  private svc = inject(AdminService);
  private fb = inject(FormBuilder);
  accounts: any[] = [];
  users: any[] = [];
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  limitEdit: any = null;
  newLimit = 20000;

  form = this.fb.group({
    userId: ['', Validators.required],
    accountType: ['savings', Validators.required],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
    dailyLimit: [20000, [Validators.required, Validators.min(1000)]],
    pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });

  ngOnInit() { this.loadAccounts(); this.loadUsers(); }
  loadAccounts() { this.svc.getAllAccounts().subscribe(r => this.accounts = r.accounts); }
  loadUsers() { this.svc.getAllUsers().subscribe(r => this.users = r.users); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.successMsg = '';
    this.svc.createAccount(this.form.value).subscribe({
      next: (r) => {
        this.loading = false;
        this.successMsg = `Account ${r.account.accountNumber} opened successfully!`;
        this.form.reset({ accountType: 'savings', initialBalance: 0, dailyLimit: 20000 });
        this.loadAccounts();
      },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Error creating account'; }
    });
  }

  toggle(account: any) { this.svc.toggleAccount(account._id).subscribe(() => this.loadAccounts()); }

  editLimit(account: any) { this.limitEdit = account; this.newLimit = account.dailyLimit; }

  saveLimit() {
    this.svc.updateDailyLimit(this.limitEdit._id, this.newLimit).subscribe(() => {
      this.limitEdit = null;
      this.loadAccounts();
    });
  }
}
