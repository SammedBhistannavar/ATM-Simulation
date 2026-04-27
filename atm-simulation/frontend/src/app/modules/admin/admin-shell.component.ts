import { Component } from '@angular/core';
import { LayoutComponent, NavItem } from '../../shared/components/layout.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout title="Admin Panel" role="admin" [navItems]="navItems"></app-layout>`
})
export class AdminShellComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: '📊', route: '/admin/dashboard' },
    { label: 'Manage Users', icon: '👥', route: '/admin/users' },
    { label: 'Accounts',     icon: '🏦', route: '/admin/accounts' },
    { label: 'Transactions', icon: '💳', route: '/admin/transactions' }
  ];
}
