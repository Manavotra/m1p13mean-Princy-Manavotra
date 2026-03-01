// services/auth.service.ts

import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

// Centralisation de l'URL
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

constructor(private http: HttpClient, private zone: NgZone) {}

login(data: any, withCred: boolean = true) {
    return this.http.post(`${this.apiUrl}login`, data, {
      withCredentials: withCred
    });
  }

  logout() {
    return this.http.post(`${this.apiUrl}logout`, {}, { withCredentials: true });
  }

    getMe() {
        return this.http.get(`${this.apiUrl}me`, { withCredentials: true }).pipe(
        map(user$ => this.zone.run(() => user$))
        );
    }

  setUser(user: any) {
    this.userSubject.next(user);
  }
}