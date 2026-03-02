// pages/login.page.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">

          <div class="flex items-center justify-between">
            <h2 class="card-title text-2xl">Login</h2>
          </div>

          <p class="text-sm opacity-70">
            Connectez-vous pour accéder à votre compte.
          </p>

          <form (ngSubmit)="submit()" class="mt-4 space-y-4">

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                class="input input-bordered w-full"
                [(ngModel)]="email"
                name="email"
                type="email"
                placeholder="ex: nom@email.com"
                autocomplete="email"
                [disabled]="loading"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Mot de passe</span>
              </label>
              <input
                class="input input-bordered w-full"
                [(ngModel)]="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                [disabled]="loading"
                required
              />
              <label class="label">
                <span class="label-text-alt opacity-70">
                  Utilisez vos identifiants habituels.
                </span>
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              [disabled]="loading"
            >
              <span *ngIf="!loading">Se connecter</span>
              <span *ngIf="loading" class="flex items-center gap-2">
                <span class="loading loading-spinner loading-xs"></span>
                Connexion...
              </span>
            </button>

            <div *ngIf="error" class="alert alert-error">
              <span>{{ error }}</span>
            </div>

            <div class="divider">OU</div>

            <a routerLink="/users/create" class="btn btn-outline w-full">
              S'inscrire
            </a>
          </form>

        </div>
      </div>
    </div>
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

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        switch (res.user.role) {
          case 'ADMIN':
            this.router.navigate(['/admin-dashboard']);
            break;
          case 'VENDEUR':
            this.router.navigate(['/product']);
            break;
          default:
            this.router.navigate(['/product']);
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