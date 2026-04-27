import { Component } from '@angular/core';
import { LayoutComponent, NavItem } from '../../shared/components/layout.component';

@Component({
  selector: 'app-superadmin-shell',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout title="Super Admin Panel" role="superadmin" [navItems]="navItems"></app-layout>
  `
})
export class SuperadminShellComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: '📊', route: '/superadmin/dashboard' },
    { label: 'Manage Admins',icon: '👨‍💼', route: '/superadmin/admins' },
    { label: 'All Users',    icon: '👥', route: '/superadmin/users' },
    { label: 'All Accounts', icon: '🏦', route: '/superadmin/accounts' },
    { label: 'Transactions', icon: '💳', route: '/superadmin/transactions' }
  ];
}
