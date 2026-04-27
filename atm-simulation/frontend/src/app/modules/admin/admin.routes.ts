import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: 'dashboard',    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users',        loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'accounts',     loadComponent: () => import('./pages/admin-accounts/admin-accounts.component').then(m => m.AdminAccountsComponent) },
      { path: 'transactions', loadComponent: () => import('./pages/admin-transactions/admin-transactions.component').then(m => m.AdminTransactionsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
