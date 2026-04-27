import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2 class="section-title">Admin Dashboard</h2>
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card blue">
          <div class="stat-icon">👥</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">My Users</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">🏦</div>
          <div class="stat-value">{{ stats.activeAccounts }}</div>
          <div class="stat-label">Active Accounts</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon">💳</div>
          <div class="stat-value">{{ stats.totalTransactions }}</div>
          <div class="stat-label">Total Transactions</div>
        </div>
        <div class="stat-card teal">
          <div class="stat-icon">⬆️</div>
          <div class="stat-value">{{ stats.totalDeposits | currency:'INR':'symbol':'1.0-0' }}</div>
          <div class="stat-label">Total Deposits</div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">⬇️</div>
          <div class="stat-value">{{ stats.totalWithdrawals | currency:'INR':'symbol':'1.0-0' }}</div>
          <div class="stat-label">Total Withdrawals</div>
        </div>
      </div>

      <div class="recent-section">
        <h3>Recent Transactions</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Reference</th><th>User</th><th>Account</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of recentTxn">
                <td><code>{{ t.reference }}</code></td>
                <td>{{ t.userId?.name || 'N/A' }}</td>
                <td><code>{{ t.accountId?.accountNumber }}</code></td>
                <td><span [class]="'type-badge type-' + t.type">{{ t.type }}</span></td>
                <td>{{ t.amount | currency:'INR':'symbol':'1.0-0' }}</td>
                <td><span [class]="'status-badge status-' + t.status">{{ t.status }}</span></td>
                <td>{{ t.createdAt | date:'dd MMM, HH:mm' }}</td>
              </tr>
              <tr *ngIf="!recentTxn.length">
                <td colspan="7" class="empty">No transactions yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width:1200px; }
    .section-title { font-size:22px; font-weight:700; color:#1a1a2e; margin:0 0 20px; }
    .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; margin-bottom:32px; }
    .stat-card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 12px rgba(0,0,0,0.06);
      display:flex; flex-direction:column; align-items:flex-start; border-left:4px solid; }
    .stat-card.blue { border-color:#3498db; }
    .stat-card.green { border-color:#27ae60; }
    .stat-card.purple { border-color:#9b59b6; }
    .stat-card.teal { border-color:#1abc9c; }
    .stat-card.orange { border-color:#f39c12; }
    .stat-icon { font-size:28px; margin-bottom:8px; }
    .stat-value { font-size:22px; font-weight:700; color:#1a1a2e; }
    .stat-label { font-size:13px; color:#888; margin-top:4px; }
    .recent-section h3 { font-size:18px; font-weight:700; color:#1a1a2e; margin:0 0 14px; }
    .table-wrap { background:#fff; border-radius:12px; overflow:auto; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; }
    code { font-size:11px; background:#f0f4f8; padding:2px 6px; border-radius:4px; }
    .type-badge, .status-badge { padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; }
    .type-deposit { background:#d5f5e3; color:#1e8449; }
    .type-withdrawal { background:#fdecea; color:#c0392b; }
    .type-transfer { background:#d6eaf8; color:#1a5276; }
    .type-balance_inquiry { background:#fef9e7; color:#7d6608; }
    .status-success { background:#d5f5e3; color:#1e8449; }
    .status-failed { background:#fdecea; color:#c0392b; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private svc = inject(AdminService);
  stats: any = null;
  recentTxn: any[] = [];

  ngOnInit() {
    this.svc.getDashboard().subscribe(res => {
      this.stats = res.stats;
      this.recentTxn = res.recentTransactions;
    });
  }
}
