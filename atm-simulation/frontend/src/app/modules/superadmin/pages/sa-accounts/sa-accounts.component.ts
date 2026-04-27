import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-sa-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header"><h2>All Bank Accounts</h2></div>
      <div class="table-card">
        <table>
          <thead><tr><th>#</th><th>Account No.</th><th>Owner</th><th>Type</th><th>Balance</th><th>Daily Limit</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of accounts; let i = index">
              <td>{{ i+1 }}</td>
              <td><code>{{ a.accountNumber }}</code></td>
              <td>{{ a.userId?.name || 'N/A' }}<br><small>{{ a.userId?.email }}</small></td>
              <td><span class="type-badge">{{ a.accountType }}</span></td>
              <td class="amount">{{ a.balance | currency:'INR':'symbol':'1.0-0' }}</td>
              <td>{{ a.dailyLimit | currency:'INR':'symbol':'1.0-0' }}</td>
              <td><span [class]="'badge ' + (a.isActive ? 'active' : 'inactive')">{{ a.isActive ? 'Active' : 'Blocked' }}</span></td>
              <td>{{ a.createdAt | date:'dd MMM yyyy' }}</td>
            </tr>
            <tr *ngIf="accounts.length === 0"><td colspan="8" class="empty">No accounts found.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1200px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    h2 { margin:0; font-size:22px; font-weight:700; color:#1a1a2e; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; vertical-align:top; }
    small { color:#888; font-size:12px; }
    code { font-size:12px; background:#f0f4f8; padding:2px 6px; border-radius:4px; }
    .type-badge { padding:3px 10px; border-radius:12px; font-size:12px; background:#eaf4fb; color:#1a5276; font-weight:600; text-transform:capitalize; }
    .amount { font-weight:700; color:#1e8449; }
    .badge { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
    .active { background:#d5f5e3; color:#1e8449; }
    .inactive { background:#fdecea; color:#c0392b; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class SaAccountsComponent implements OnInit {
  private svc = inject(SuperadminService);
  accounts: any[] = [];
  ngOnInit() { this.svc.getAllAccounts().subscribe(r => this.accounts = r.accounts); }
}
