import { Component } from '@angular/core';
import { LayoutComponent, NavItem } from '../../shared/components/layout.component';

@Component({
  selector: 'app-user-shell',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout title="ATM Banking" role="user" [navItems]="navItems"></app-layout>`
})
export class UserShellComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',      icon: '🏠', route: '/user/dashboard' },
    { label: 'Withdraw Cash',  icon: '💸', route: '/user/withdraw' },
    { label: 'Deposit Cash',   icon: '💰', route: '/user/deposit' },
    { label: 'Fund Transfer',  icon: '🔄', route: '/user/transfer' },
    { label: 'Mini Statement', icon: '📋', route: '/user/history' },
    { label: 'Change PIN',     icon: '🔐', route: '/user/change-pin' }
  ];
}
