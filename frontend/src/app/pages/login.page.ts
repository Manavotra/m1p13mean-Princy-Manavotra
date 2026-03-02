// pages/login.page.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="email" name="email" placeholder="Email" />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" />
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
      <p *ngIf="error" style="color:red">{{ error }}</p>
    </form>
  `
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = '';

    // Le tap() dans auth.service setUser automatiquement via le pipe
    // On n'a donc PAS besoin d'appeler setUser ni getMe ici
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Redirection selon le rôle stocké dans le BehaviorSubject par le tap()
        switch (res.user.role) {
          case 'ADMIN':
            this.router.navigate(['/order']);
            break;
          case 'VENDEUR':
            this.router.navigate(['/']);
            break;
          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Email ou mot de passe incorrect';
        console.error('LOGIN ERROR', err);
      }
    });
  }
}