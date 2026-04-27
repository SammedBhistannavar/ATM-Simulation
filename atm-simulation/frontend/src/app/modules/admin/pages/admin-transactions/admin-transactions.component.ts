import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header"><h2>All Transactions</h2></div>
      <div class="table-card">
        <table>
          <thead>
            <tr><th>Reference</th><th>User</th><th>Account</th><th>Type</th><th>Amount</th><th>Before</th><th>After</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transactions">
              <td><code>{{ t.reference }}</code></td>
              <td>{{ t.userId?.name || 'N/A' }}</td>
              <td><code>{{ t.accountId?.accountNumber }}</code></td>
              <td><span [class]="'type-badge type-' + t.type">{{ t.type | titlecase }}</span></td>
              <td [class]="t.type==='withdrawal'||t.type==='transfer' ? 'neg' : 'pos'">
                {{ t.type==='withdrawal'||t.type==='transfer' ? '-' : '+' }}{{ t.amount | currency:'INR':'symbol':'1.0-0' }}
              </td>
              <td>{{ t.balanceBefore | currency:'INR':'symbol':'1.0-0' }}</td>
              <td>{{ t.balanceAfter | currency:'INR':'symbol':'1.0-0' }}</td>
              <td><span [class]="'s-' + t.status">{{ t.status }}</span></td>
              <td>{{ t.createdAt | date:'dd MMM yy, HH:mm' }}</td>
            </tr>
            <tr *ngIf="!transactions.length"><td colspan="9" class="empty">No transactions.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1300px; }
    .page-header { margin-bottom:20px; }
    h2 { margin:0; font-size:22px; font-weight:700; color:#1a1a2e; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:13px; color:#333; }
    code { font-size:11px; background:#f0f4f8; padding:2px 6px; border-radius:4px; }
    .type-badge { padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; }
    .type-deposit { background:#d5f5e3; color:#1e8449; }
    .type-withdrawal { background:#fdecea; color:#c0392b; }
    .type-transfer { background:#d6eaf8; color:#1a5276; }
    .type-balance_inquiry { background:#fef9e7; color:#7d6608; }
    .pos { color:#1e8449; font-weight:700; }
    .neg { color:#c0392b; font-weight:700; }
    .s-success { color:#1e8449; font-weight:600; font-size:12px; }
    .s-failed { color:#c0392b; font-weight:600; font-size:12px; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class AdminTransactionsComponent implements OnInit {
  private svc = inject(AdminService);
  transactions: any[] = [];
  ngOnInit() { this.svc.getAllTransactions().subscribe(r => this.transactions = r.transactions); }
}
