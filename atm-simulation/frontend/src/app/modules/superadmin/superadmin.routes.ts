import { Routes } from '@angular/router';
import { SuperadminShellComponent } from './superadmin-shell.component';

export const SUPERADMIN_ROUTES: Routes = [
  {
    path: '',
    component: SuperadminShellComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/sa-dashboard/sa-dashboard.component').then(m => m.SaDashboardComponent) },
      { path: 'admins',    loadComponent: () => import('./pages/sa-admins/sa-admins.component').then(m => m.SaAdminsComponent) },
      { path: 'users',     loadComponent: () => import('./pages/sa-users/sa-users.component').then(m => m.SaUsersComponent) },
      { path: 'accounts',  loadComponent: () => import('./pages/sa-accounts/sa-accounts.component').then(m => m.SaAccountsComponent) },
      { path: 'transactions', loadComponent: () => import('./pages/sa-transactions/sa-transactions.component').then(m => m.SaTransactionsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
