import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-sa-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header"><h2>All Users</h2></div>
      <div class="table-card">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Registered</th><th>Last Login</th></tr></thead>
          <tbody>
            <tr *ngFor="let u of users; let i = index">
              <td>{{ i+1 }}</td>
              <td><strong>{{ u.name }}</strong></td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone || '—' }}</td>
              <td><span [class]="'badge ' + (u.isActive ? 'active' : 'inactive')">{{ u.isActive ? 'Active' : 'Blocked' }}</span></td>
              <td>{{ u.createdAt | date:'dd MMM yyyy' }}</td>
              <td>{{ u.lastLogin ? (u.lastLogin | date:'dd MMM, HH:mm') : 'Never' }}</td>
            </tr>
            <tr *ngIf="users.length === 0"><td colspan="7" class="empty">No users found.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1100px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    h2 { margin:0; font-size:22px; font-weight:700; color:#1a1a2e; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; }
    .badge { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
    .active { background:#d5f5e3; color:#1e8449; }
    .inactive { background:#fdecea; color:#c0392b; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class SaUsersComponent implements OnInit {
  private svc = inject(SuperadminService);
  users: any[] = [];
  ngOnInit() { this.svc.getAllUsers().subscribe(r => this.users = r.users); }
}
