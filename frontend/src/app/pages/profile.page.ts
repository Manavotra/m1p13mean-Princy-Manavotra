// pages/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="user">
      <h2>Profil</h2>
      <!-- 🖼 Avatar -->
      <div class="avatar-container">
        <img 
          [src]="user.avatar || 'uploads/default.jpg'" 
          alt="Avatar"
          class="avatar"
        />
      </div>
      <p><strong>Nom :</strong> {{ user.name }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Rôle :</strong> {{ user.role }}</p>
      <button (click)="logout()">Logout</button>
    
      <hr>

      <a routerLink="/cart">Modifier profil###</a>


        <!-- 🔹 Lien conditionnel si admin -->
        <div *ngIf="user.role === 'ADMIN'">
            <a routerLink="/cart">Shop approuvés###</a>
            <a routerLink="/cart">Shop en attente###</a>
            <a routerLink="/cart">Shop bannis###</a>
            <a routerLink="/cart">dashoboard###</a>
            <a routerLink="/cart">Commende expediés###
            (ovainy LIVREE,changement possible status:
            'EXPEDIEE', 'LIVREE'</a>
        </div>
        <div *ngIf="user.role === 'VENDEUR'">
            <a routerLink="/shop">Créer un Shop</a>
            <a routerLink="/cart">Mes shop###</a>
            <a routerLink="/cart">Commande recentes###
            (ovainy en preparation,changement possible status:
            'NOUVELLE', 'EN_PREPARATION')</a>
            <a routerLink="/cart">Commende en preparation###
            (ovainy EXPEDIEE,changement possible status:
            'EN_PREPARATION', 'EXPEDIEE'</a>
        </div>
        <div *ngIf="user.role !== 'ADMIN' && user.role !== 'VENDEUR'">
            <a routerLink="/favorite">Favoris</a>
            <a routerLink="/cart">Panier</a>
            <a routerLink="/cart">Historique###</a>
            <a routerLink="/cart">Facture###</a>
        </div>

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