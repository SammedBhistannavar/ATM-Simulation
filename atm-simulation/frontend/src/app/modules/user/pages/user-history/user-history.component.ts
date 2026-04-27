import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAtmService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header"><h2>📋 Mini Statement</h2></div>
      <div class="table-card">
        <table>
          <thead>
            <tr><th>Date</th><th>Account</th><th>Description</th><th>Type</th><th>Amount</th><th>Balance</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transactions">
              <td>{{ t.createdAt | date:'dd MMM yy, HH:mm' }}</td>
              <td><code>{{ t.accountId?.accountNumber }}</code><br><small>{{ t.accountId?.accountType | titlecase }}</small></td>
              <td>{{ t.description || (t.type | titlecase) }}</td>
              <td><span [class]="'type-badge type-' + t.type">{{ t.type | titlecase }}</span></td>
              <td [class]="t.type==='deposit' ? 'pos' : t.type==='balance_inquiry' ? 'neutral' : 'neg'">
                <span *ngIf="t.type !== 'balance_inquiry'">{{ t.type === 'deposit' ? '+' : '-' }}{{ t.amount | currency:'INR':'symbol':'1.0-0' }}</span>
                <span *ngIf="t.type === 'balance_inquiry'">—</span>
              </td>
              <td class="balance-col">{{ t.balanceAfter | currency:'INR':'symbol':'1.0-0' }}</td>
            </tr>
            <tr *ngIf="!transactions.length">
              <td colspan="6" class="empty">No transactions found. Start banking!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1000px; }
    .page-header { margin-bottom:20px; }
    h2 { margin:0; font-size:22px; font-weight:700; color:#1a1a2e; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; vertical-align:top; }
    small { color:#888; font-size:12px; }
    code { font-size:12px; background:#f0f4f8; padding:2px 6px; border-radius:4px; }
    .type-badge { padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; }
    .type-deposit { background:#d5f5e3; color:#1e8449; }
    .type-withdrawal { background:#fdecea; color:#c0392b; }
    .type-transfer { background:#d6eaf8; color:#1a5276; }
    .type-balance_inquiry { background:#fef9e7; color:#7d6608; }
    .pos { color:#1e8449; font-weight:700; }
    .neg { color:#c0392b; font-weight:700; }
    .neutral { color:#888; }
    .balance-col { font-weight:600; color:#333; }
    .empty { text-align:center; color:#aaa; padding:40px; }
  `]
})
export class UserHistoryComponent implements OnInit {
  private svc = inject(UserAtmService);
  transactions: any[] = [];
  ngOnInit() { this.svc.getTransactions().subscribe(r => this.transactions = r.transactions); }
}
