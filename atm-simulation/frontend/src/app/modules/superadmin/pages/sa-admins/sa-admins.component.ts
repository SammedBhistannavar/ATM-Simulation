import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SuperadminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-sa-admins',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Manage Admins</h2>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Add Admin' }}</button>
      </div>

      <div class="form-card" *ngIf="showForm">
        <h3>Create New Admin</h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="field">
              <label>Full Name</label>
              <input formControlName="name" placeholder="Admin name" />
            </div>
            <div class="field">
              <label>Email</label>
              <input formControlName="email" type="email" placeholder="admin@example.com" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>Phone</label>
              <input formControlName="phone" placeholder="Phone number" />
            </div>
            <div class="field">
              <label>Password</label>
              <input formControlName="password" type="password" placeholder="Min 6 characters" />
            </div>
          </div>
          <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Creating...' : 'Create Admin' }}</button>
        </form>
      </div>

      <div class="table-card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let admin of admins; let i = index">
                <td>{{ i + 1 }}</td>
                <td><strong>{{ admin.name }}</strong></td>
                <td>{{ admin.email }}</td>
                <td>{{ admin.phone || '—' }}</td>
                <td>
                  <span [class]="'status-badge ' + (admin.isActive ? 'active' : 'inactive')">
                    {{ admin.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ admin.createdAt | date:'dd MMM yyyy' }}</td>
                <td>
                  <button class="btn-sm" (click)="toggle(admin)">{{ admin.isActive ? '🔒 Block' : '✅ Activate' }}</button>
                  <button class="btn-sm danger" (click)="delete(admin._id)">🗑 Delete</button>
                </td>
              </tr>
              <tr *ngIf="admins.length === 0">
                <td colspan="7" class="empty">No admins found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1100px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    h2 { margin:0; font-size:22px; font-weight:700; color:#1a1a2e; }
    .form-card { background:#fff; border-radius:12px; padding:24px; margin-bottom:20px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
    h3 { margin:0 0 16px; font-size:16px; color:#333; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .field { margin-bottom:14px; }
    label { display:block; font-size:13px; font-weight:600; color:#555; margin-bottom:6px; }
    input { width:100%; padding:10px 12px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    input:focus { border-color:#3498db; outline:none; }
    .msg { padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:12px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .btn-primary { padding:10px 20px; background:linear-gradient(135deg,#3498db,#2980b9); color:#fff;
      border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; }
    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden; }
    .table-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; }
    .status-badge { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
    .active { background:#d5f5e3; color:#1e8449; }
    .inactive { background:#fdecea; color:#c0392b; }
    .btn-sm { padding:5px 12px; border:none; border-radius:6px; font-size:12px; cursor:pointer;
      background:#eaf4fb; color:#2980b9; margin-right:6px; font-weight:500; }
    .btn-sm.danger { background:#fdecea; color:#c0392b; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class SaAdminsComponent implements OnInit {
  private svc = inject(SuperadminService);
  private fb = inject(FormBuilder);
  admins: any[] = [];
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() { this.load(); }
  load() { this.svc.getAllAdmins().subscribe(r => this.admins = r.admins); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.successMsg = '';
    this.svc.createAdmin(this.form.value).subscribe({
      next: () => { this.loading = false; this.successMsg = 'Admin created!'; this.form.reset(); this.load(); },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Error'; }
    });
  }

  toggle(admin: any) {
    this.svc.toggleAdmin(admin._id).subscribe(() => this.load());
  }

  delete(id: string) {
    if (confirm('Delete this admin?')) this.svc.deleteAdmin(id).subscribe(() => this.load());
  }
}
