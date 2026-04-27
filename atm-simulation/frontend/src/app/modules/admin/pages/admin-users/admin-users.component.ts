import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Manage Users</h2>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Create User' }}</button>
      </div>

      <div class="form-card" *ngIf="showForm">
        <h3>Create New User</h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="field">
              <label>Full Name</label>
              <input formControlName="name" placeholder="User full name" />
            </div>
            <div class="field">
              <label>Email</label>
              <input formControlName="email" type="email" placeholder="user@example.com" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>Phone</label>
              <input formControlName="phone" placeholder="10-digit number" />
            </div>
            <div class="field">
              <label>Password</label>
              <input formControlName="password" type="password" placeholder="Min 6 characters" />
            </div>
          </div>
          <div class="msg error" *ngIf="errorMsg">{{ errorMsg }}</div>
          <div class="msg success" *ngIf="successMsg">{{ successMsg }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Creating...' : 'Create User' }}</button>
        </form>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Registered</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users; let i = index">
              <td>{{ i+1 }}</td>
              <td><strong>{{ u.name }}</strong></td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone || '—' }}</td>
              <td><span [class]="'badge ' + (u.isActive ? 'active' : 'inactive')">{{ u.isActive ? 'Active' : 'Blocked' }}</span></td>
              <td>{{ u.createdAt | date:'dd MMM yyyy' }}</td>
              <td>
                <button class="btn-sm" (click)="toggle(u)">{{ u.isActive ? '🔒 Block' : '✅ Activate' }}</button>
              </td>
            </tr>
            <tr *ngIf="!users.length"><td colspan="7" class="empty">No users found.</td></tr>
          </tbody>
        </table>
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
    input, select { width:100%; padding:10px 12px; border:2px solid #e0e0e0; border-radius:8px; font-size:14px; box-sizing:border-box; }
    input:focus, select:focus { border-color:#3498db; outline:none; }
    .msg { padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:12px; }
    .error { background:#fdecea; color:#c0392b; }
    .success { background:#d5f5e3; color:#1e8449; }
    .btn-primary { padding:10px 20px; background:linear-gradient(135deg,#3498db,#2980b9); color:#fff;
      border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; }
    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
    .table-card { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8f9fa; padding:12px 16px; text-align:left; font-size:13px; color:#555; font-weight:600; }
    td { padding:12px 16px; border-top:1px solid #f0f0f0; font-size:14px; color:#333; }
    .badge { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
    .active { background:#d5f5e3; color:#1e8449; }
    .inactive { background:#fdecea; color:#c0392b; }
    .btn-sm { padding:5px 12px; border:none; border-radius:6px; font-size:12px; cursor:pointer; background:#eaf4fb; color:#2980b9; font-weight:500; }
    .empty { text-align:center; color:#aaa; padding:32px; }
  `]
})
export class AdminUsersComponent implements OnInit {
  private svc = inject(AdminService);
  private fb = inject(FormBuilder);
  users: any[] = [];
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
  load() { this.svc.getAllUsers().subscribe(r => this.users = r.users); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = ''; this.successMsg = '';
    this.svc.createUser(this.form.value).subscribe({
      next: () => { this.loading = false; this.successMsg = 'User created successfully!'; this.form.reset(); this.load(); },
      error: err => { this.loading = false; this.errorMsg = err.error?.message || 'Error creating user'; }
    });
  }

  toggle(user: any) {
    this.svc.toggleUser(user._id).subscribe(() => this.load());
  }
}
