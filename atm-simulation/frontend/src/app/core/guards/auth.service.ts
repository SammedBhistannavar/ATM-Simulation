import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  phone: string;
  isActive: boolean;
  lastLogin: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API = 'http://localhost:5000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('atm_user');
    return user ? JSON.parse(user) : null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('atm_token');
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('atm_token', res.token);
        localStorage.setItem('atm_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.API}/register`, data).pipe(
      tap(res => {
        localStorage.setItem('atm_token', res.token);
        localStorage.setItem('atm_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('atm_token');
    localStorage.removeItem('atm_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${this.API}/change-password`, data);
  }

  redirectByRole(role: string): void {
    const routes: Record<string, string> = {
      superadmin: '/superadmin/dashboard',
      admin: '/admin/dashboard',
      user: '/user/dashboard'
    };
    this.router.navigate([routes[role] || '/auth/login']);
  }

  forgotPassword(email: string, password:string) {
        return this.http.post(`${this.API}/forgotPassword`, { email,password });
  }
}
