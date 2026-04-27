import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'superadmin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['superadmin'] },
    loadChildren: () => import('./modules/superadmin/superadmin.routes').then(m => m.SUPERADMIN_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'superadmin'] },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'user',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['user'] },
    loadChildren: () => import('./modules/user/user.routes').then(m => m.USER_ROUTES)
  },
  { path: '**', redirectTo: '/auth/login' }
];
