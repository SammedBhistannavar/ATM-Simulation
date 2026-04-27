import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class SuperadminService {
  private http = inject(HttpClient);
  private url = `${BASE}/superadmin`;

  getDashboard(): Observable<any>           { return this.http.get(`${this.url}/dashboard`); }
  getAllAdmins(): Observable<any>            { return this.http.get(`${this.url}/admins`); }
  createAdmin(data: any): Observable<any>   { return this.http.post(`${this.url}/admins`, data); }
  toggleAdmin(id: string): Observable<any>  { return this.http.patch(`${this.url}/admins/${id}/toggle`, {}); }
  deleteAdmin(id: string): Observable<any>  { return this.http.delete(`${this.url}/admins/${id}`); }
  getAllUsers(): Observable<any>             { return this.http.get(`${this.url}/users`); }
  getAllAccounts(): Observable<any>          { return this.http.get(`${this.url}/accounts`); }
  getAllTransactions(): Observable<any>      { return this.http.get(`${this.url}/transactions`); }
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private url = `${BASE}/admin`;

  getDashboard(): Observable<any>                        { return this.http.get(`${this.url}/dashboard`); }
  getAllUsers(): Observable<any>                          { return this.http.get(`${this.url}/users`); }
  createUser(data: any): Observable<any>                 { return this.http.post(`${this.url}/users`, data); }
  toggleUser(id: string): Observable<any>                { return this.http.patch(`${this.url}/users/${id}/toggle`, {}); }
  getAllAccounts(): Observable<any>                       { return this.http.get(`${this.url}/accounts`); }
  createAccount(data: any): Observable<any>              { return this.http.post(`${this.url}/accounts`, data); }
  toggleAccount(id: string): Observable<any>             { return this.http.patch(`${this.url}/accounts/${id}/toggle`, {}); }
  updateDailyLimit(id: string, limit: number): Observable<any> { return this.http.patch(`${this.url}/accounts/${id}/daily-limit`, { dailyLimit: limit }); }
  getAllTransactions(): Observable<any>                   { return this.http.get(`${this.url}/transactions`); }
}

@Injectable({ providedIn: 'root' })
export class UserAtmService {
  private http = inject(HttpClient);
  private url = `${BASE}/user`;

  getMyAccounts(): Observable<any>                   { return this.http.get(`${this.url}/accounts`); }
  verifyPin(data: any): Observable<any>              { return this.http.post(`${this.url}/verify-pin`, data); }
  checkBalance(accountId: string): Observable<any>   { return this.http.get(`${this.url}/balance/${accountId}`); }
  withdraw(data: any): Observable<any>               { return this.http.post(`${this.url}/withdraw`, data); }
  deposit(data: any): Observable<any>                { return this.http.post(`${this.url}/deposit`, data); }
  transfer(data: any): Observable<any>               { return this.http.post(`${this.url}/transfer`, data); }
  getTransactions(): Observable<any>                 { return this.http.get(`${this.url}/transactions`); }
  changePin(data: any): Observable<any>              { return this.http.post(`${this.url}/change-pin`, data); }
  getProfile(): Observable<any>                      { return this.http.get(`${this.url}/profile`); }
}
