// pages/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="user">
      <h2>Profil</h2>
      <p><strong>Nom :</strong> {{ user.name }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Rôle :</strong> {{ user.role }}</p>
      <button (click)="logout()">Logout</button>

    </div>
    <div *ngIf="!user && !loading">
      <p>Non connecté. <a routerLink="/login">Se connecter</a></p>
    </div>
  `
})
export class ProfilePage implements OnInit {
  user: any = null;
  loading = true;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // 1. Si le user est déjà en mémoire (vient de se connecter), on l'utilise directement
    const cached = this.auth.getUser();
    if (cached) {
      this.user = cached;
      this.loading = false;
      return;
    }

    // 2. Sinon, tentative de restauration de session via cookie (refresh de page)
    this.auth.getMe().subscribe({
      next: (user: any) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        // Session expirée ou non connecté → redirection login
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

    logout() {
        this.auth.logout().subscribe(() => {
        // Pour le logout, on redirige simplement
        location.href = '/login';
        });
    }
}