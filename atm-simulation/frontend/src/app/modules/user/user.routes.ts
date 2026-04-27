import { Routes } from '@angular/router';
import { UserShellComponent } from './user-shell.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserShellComponent,
    children: [
      { path: 'dashboard',   loadComponent: () => import('./pages/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent) },
      { path: 'withdraw',    loadComponent: () => import('./pages/user-withdraw/user-withdraw.component').then(m => m.UserWithdrawComponent) },
      { path: 'deposit',     loadComponent: () => import('./pages/user-deposit/user-deposit.component').then(m => m.UserDepositComponent) },
      { path: 'transfer',    loadComponent: () => import('./pages/user-transfer/user-transfer.component').then(m => m.UserTransferComponent) },
      { path: 'history',     loadComponent: () => import('./pages/user-history/user-history.component').then(m => m.UserHistoryComponent) },
      { path: 'change-pin',  loadComponent: () => import('./pages/user-changepin/user-changepin.component').then(m => m.UserChangePinComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
