import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserAtmService } from '../../../../shared/services/api.service';
import { AuthService } from '../../../../core/guards/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h2>Welcome back, {{ user?.name }}! 👋</h2>
          <p>Manage your accounts and transactions securely.</p>
        </div>
        <div class="welcome-icon">🏧</div>
      </div>

      <div *ngIf="accounts.length === 0" class="no-account">
        <p>🏦 No bank accounts found. Please contact your bank admin to open an account.</p>
      </div>

      <div class="accounts-grid">
        <div class="account-card" *ngFor="let acc of accounts">
          <div class="card-header">
            <span class="acc-type">{{ acc.accountType | titlecase }} Account</span>
            <span class="acc-status active">● Active</span>
          </div>
          <div class="acc-number">{{ acc.accountNumber }}</div>
          <div class="balance-label">Available Balance</div>
          <div class="balance">{{ acc.balance | currency:'INR':'symbol':'1.0-0' }}</div>
          <div class="daily-info">
            Daily Limit: {{ acc.dailyLimit | currency:'INR':'symbol':'1.0-0' }} &nbsp;|&nbsp;
            Used Today: {{ acc.withdrawnToday | currency:'INR':'symbol':'1.0-0' }}
          </div>
        </div>
      </div>

      <div class="quick-actions" *ngIf="accounts.length > 0">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <a routerLink="/user/withdraw" class="action-btn withdraw">
            <span class="action-icon">💸</span>
            <span>Withdraw</span>
          </a>
          <a routerLink="/user/deposit" class="action-btn deposit">
            <span class="action-icon">💰</span>
            <span>Deposit</span>
          </a>
          <a routerLink="/user/transfer" class="action-btn transfer">
            <span class="action-icon">🔄</span>
            <span>Transfer</span>
          </a>
          <a routerLink="/user/history" class="action-btn history">
            <span class="action-icon">📋</span>
            <span>Statement</span>
          </a>
        </div>
      </div>

      <div class="recent-txn" *ngIf="transactions.length > 0">
        <h3>Recent Transactions</h3>
        <div class="txn-list">
          <div class="txn-item" *ngFor="let t of transactions.slice(0, 5)">
            <div class="txn-icon" [class]="'txn-' + t.type">
              {{ t.type === 'deposit' ? '⬆️' : t.type === 'withdrawal' ? '⬇️' : t.type === 'transfer' ? '🔄' : '👁️' }}
            </div>
            <div class="txn-details">
              <div class="txn-desc">{{ t.description || t.type }}</div>
              <div class="txn-date">{{ t.createdAt | date:'dd MMM yyyy, HH:mm' }}</div>
            </div>
            <div [class]="'txn-amount ' + (t.type==='deposit' ? 'pos' : 'neg')">
              {{ t.type === 'deposit' ? '+' : '-' }}{{ t.amount | currency:'INR':'symbol':'1.0-0' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width:900px; }
    .welcome-banner { background:linear-gradient(135deg,#1a1a2e,#16213e); color:#fff;
      border-radius:16px; padding:28px 32px; display:flex; justify-content:space-between;
      align-items:center; margin-bottom:24px; }
    .welcome-text h2 { margin:0 0 6px; font-size:22px; }
    .welcome-text p { margin:0; color:rgba(255,255,255,0.7); font-size:14px; }
    .welcome-icon { font-size:56px; }
    .no-account { background:#fef9e7; border:1px solid #f9ca24; border-radius:12px; padding:20px 24px;
      color:#7d6608; font-size:15px; margin-bottom:24px; }
    .accounts-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:28px; }
    .account-card { background:linear-gradient(135deg,#203a43,#2c5364); color:#fff; border-radius:16px; padding:24px; }
    .card-header { display:flex; justify-content:space-between; margin-bottom:16px; }
    .acc-type { font-size:13px; font-weight:600; opacity:0.8; }
    .acc-status.active { font-size:12px; color:#2ecc71; }
    .acc-number { font-size:16px; letter-spacing:2px; font-family:monospace; margin-bottom:16px; opacity:0.9; }
    .balance-label { font-size:12px; opacity:0.7; margin-bottom:4px; }
    .balance { font-size:32px; font-weight:700; margin-bottom:12px; }
    .daily-info { font-size:12px; opacity:0.65; }
    .quick-actions h3, .recent-txn h3 { font-size:18px; font-weight:700; color:#1a1a2e; margin:0 0 14px; }
    .actions-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
    .action-btn { display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 12px;
      border-radius:12px; text-decoration:none; color:#fff; font-size:14px; font-weight:600;
      transition:transform 0.2s; }
    .action-btn:hover { transform:translateY(-3px); }
    .action-icon { font-size:28px; }
    .withdraw { background:linear-gradient(135deg,#e74c3c,#c0392b); }
    .deposit  { background:linear-gradient(135deg,#27ae60,#1e8449); }
    .transfer { background:linear-gradient(135deg,#3498db,#2980b9); }
    .history  { background:linear-gradient(135deg,#9b59b6,#8e44ad); }
    .txn-list { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden; }
    .txn-item { display:flex; align-items:center; gap:14px; padding:14px 16px; border-bottom:1px solid #f0f0f0; }
    .txn-item:last-child { border-bottom:none; }
    .txn-icon { font-size:24px; width:40px; text-align:center; }
    .txn-details { flex:1; }
    .txn-desc { font-size:14px; font-weight:500; color:#333; text-transform:capitalize; }
    .txn-date { font-size:12px; color:#888; margin-top:2px; }
    .txn-amount { font-size:15px; font-weight:700; }
    .pos { color:#1e8449; }
    .neg { color:#c0392b; }
  `]
})
export class UserDashboardComponent implements OnInit {
  private svc = inject(UserAtmService);
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  accounts: any[] = [];
  transactions: any[] = [];

  ngOnInit() {
    this.svc.getMyAccounts().subscribe(r => this.accounts = r.accounts);
    this.svc.getTransactions().subscribe(r => this.transactions = r.transactions);
  }
}
