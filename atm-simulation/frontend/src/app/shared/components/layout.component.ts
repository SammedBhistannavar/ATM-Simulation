import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/guards/auth.service';

export interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside class="sidebar" [class.collapsed]="collapsed">
        <div class="sidebar-header">
          <span class="logo">🏧</span>
          <span class="brand" *ngIf="!collapsed">ATM System</span>
          <button class="toggle-btn" (click)="collapsed = !collapsed">{{ collapsed ? '→' : '←' }}</button>
         
        </div>
        <div class="role-badge" *ngIf="collapsed">
         <button class="toggle-btn" (click)="collapsed = !collapsed">{{ collapsed ? '→' : '' }}</button>
        </div>
        <div class="role-badge" *ngIf="!collapsed">
          <span [class]="'badge badge-' + role">{{ role | uppercase }}</span>
        </div>
        <nav class="nav">
          <a *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [title]="item.label">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <span>🚪</span>
            <span *ngIf="!collapsed"> Logout</span>
          </button>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <h2 class="page-title">{{ title }}</h2>
          </div>
          <div class="topbar-right">
            <div class="user-info">
              <div class="avatar">{{ (user?.name || 'U')[0].toUpperCase() }}</div>
              <div *ngIf="user">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
            </div>
          </div>
        </header>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; height:100vh; }
    .layout { display:flex; height:100vh; overflow:hidden; font-family:'Segoe UI',sans-serif; }
    .sidebar { width:240px; background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);
      color:#fff; display:flex; flex-direction:column; transition:width 0.3s; flex-shrink:0; }
    .sidebar.collapsed { width:64px; }
    .sidebar-header { display:flex; align-items:center; padding:20px 16px; gap:10px;
      border-bottom:1px solid rgba(255,255,255,0.1); }
    .logo { font-size:28px; }
    .brand { font-size:16px; font-weight:700; white-space:nowrap; }
    .toggle-btn { margin-left:auto; background:rgba(255,255,255,0.1); border:none; color:#fff;
      width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:14px; }
    .role-badge { padding:10px 16px; }
    .badge { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:1px; }
    .badge-superadmin { background:#f39c12; color:#000; }
    .badge-admin { background:#3498db; color:#fff; }
    .badge-user { background:#27ae60; color:#fff; }
    .nav { flex:1; padding:8px 8px; overflow-y:auto; }
    .nav-item { display:flex; align-items:center; gap:12px; padding:12px 12px; border-radius:10px;
      color:rgba(255,255,255,0.7); text-decoration:none; transition:all 0.2s; margin-bottom:4px; }
    .nav-item:hover { background:rgba(255,255,255,0.1); color:#fff; }
    .nav-item.active { background:linear-gradient(135deg,#3498db,#2980b9); color:#fff;
      box-shadow:0 4px 15px rgba(52,152,219,0.4); }
    .nav-icon { font-size:20px; min-width:24px; text-align:center; }
    .nav-label { font-size:14px; font-weight:500; white-space:nowrap; }
    .sidebar-footer { padding:16px 8px; border-top:1px solid rgba(255,255,255,0.1); }
    .logout-btn { display:flex; align-items:center; gap:12px; width:100%; padding:12px;
      background:rgba(231,76,60,0.2); border:1px solid rgba(231,76,60,0.3); color:#e74c3c;
      border-radius:10px; cursor:pointer; font-size:14px; font-weight:500; transition:all 0.2s; }
    .logout-btn:hover { background:rgba(231,76,60,0.4); }
    .main-area { flex:1; display:flex; flex-direction:column; overflow:hidden; background:#f5f7fa; }
    .topbar { background:#fff; padding:0 24px; height:64px; display:flex; align-items:center;
      justify-content:space-between; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
    .page-title { margin:0; font-size:20px; font-weight:700; color:#1a1a2e; }
    .user-info { display:flex; align-items:center; gap:12px; }
    .avatar { width:40px; height:40px; background:linear-gradient(135deg,#3498db,#2980b9);
      border-radius:50%; display:flex; align-items:center; justify-content:center;
      color:#fff; font-weight:700; font-size:16px; }
    .user-name { font-size:14px; font-weight:600; color:#333; }
    .user-email { font-size:12px; color:#888; }
    .content { flex:1; overflow-y:auto; padding:24px; }
  `]
})
export class LayoutComponent {
  @Input() title = 'Dashboard';
  @Input() navItems: NavItem[] = [];
  @Input() role = '';
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  collapsed = false;
  logout() { this.auth.logout(); }
}
