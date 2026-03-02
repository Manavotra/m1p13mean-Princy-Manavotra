// services/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private zone: NgZone) {}

  /**
   * Login — withCredentials OBLIGATOIRE pour envoyer/recevoir le cookie de session.
   * On stocke directement le user retourné par le login (pas besoin d'appeler /me après).
   */
  login(data: any, withCred: boolean = true) {
    return this.http.post(`${this.apiUrl}login`, data, {
      withCredentials: withCred
    }).pipe(
      tap((res: any) => {
        // Stocke immédiatement le user en mémoire dès le login
        if (res?.user) {
          this.userSubject.next(res.user);
        }
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.userSubject.next(null))
    );
  }

  /**
   * Appel /me pour restaurer la session après un refresh de page.
   * withCredentials OBLIGATOIRE — envoie le cookie de session au backend.
   */
  getMe() {
    return this.http.get(`${this.apiUrl}me`, { withCredentials: true }).pipe(
      tap((user: any) => {
        this.zone.run(() => this.userSubject.next(user));
      })
    );
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  /** Retourne l'utilisateur courant de façon synchrone */
  getUser(): any {
    return this.userSubject.getValue();
  }

  /** Vrai si un utilisateur est connecté */
  isLoggedIn(): boolean {
    return !!this.userSubject.getValue();
  }
}