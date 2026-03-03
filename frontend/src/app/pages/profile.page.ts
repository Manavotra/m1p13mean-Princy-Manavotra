// pages/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ✅ Navbar Header -->
    <div class="w-full">

      <!-- Loading state (optional) -->
<div *ngIf="loading"
     class="navbar bg-base-100 shadow-sm sticky top-0 z-50 w-full rounded-none border-0">
        <div class="flex-1">
          <div class="skeleton h-6 w-32"></div>
        </div>
        <div class="flex-none gap-2">
          <div class="skeleton h-10 w-10 rounded-full"></div>
        </div>
      </div>

      <!-- Logged in -->
<div *ngIf="user && !loading"
     class="navbar bg-base-100 shadow-sm sticky top-0 z-50 w-full rounded-none border-0">
        <!-- Left: Brand / Title -->
        <div class="flex-1">
          <a routerLink="/product" class="btn btn-ghost text-xl">
            Centre Commercial
          </a>
        </div>

        <!-- Center (optional): quick links (role-based) -->
        <div class="hidden md:flex flex-none">
          <ul class="menu menu-horizontal px-1 gap-1">

            <!-- ADMIN -->
            <ng-container *ngIf="user.role === 'ADMIN'">
              <li><a routerLink="/admin-dashboard">Dashboard</a></li>
              <li><a routerLink="/cart">Shops approuvés</a></li>
              <li><a routerLink="/cart">Shops en attente</a></li>
              <li><a routerLink="/cart">Shops bannis</a></li>
              <li><a routerLink="/cart">Commandes expédiées</a></li>
            </ng-container>

            <!-- VENDEUR -->
            <ng-container *ngIf="user.role === 'VENDEUR'">
              <li><a routerLink="/shop">Créer un Shop</a></li>
              <li><a routerLink="/cart">Mes shops</a></li>
              <li><a routerLink="/cart">Commandes récentes</a></li>
              <li><a routerLink="/cart">En préparation</a></li>
            </ng-container>

            <!-- ACHETEUR (DEFAULT) -->
            <ng-container *ngIf="user.role !== 'ADMIN' && user.role !== 'VENDEUR'">
              <li><a routerLink="/favorite">Favoris</a></li>
              <li><a routerLink="/cart">Panier</a></li>
              <li><a routerLink="/cart">Historique</a></li>
              <li><a routerLink="/cart">Factures</a></li>
            </ng-container>

          </ul>
        </div>

        <!-- Right: Avatar + dropdown -->
        <div class="flex-none gap-2">
          <div class="dropdown dropdown-end">

            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full ring-1 ring-base-300">
                <img
                  [src]="getImageUrl(user.avatar || 'uploads/default.jpg')"
                  alt="avatar"
                />
              </div>
            </label>

            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-72"
            >
              <!-- User info -->
              <li class="menu-title">
                <span class="truncate">{{ user.name }}</span>
                <span class="text-xs opacity-70 truncate">{{ user.email }}</span>
                <span class="text-xs opacity-70">Rôle: {{ user.role }}</span>
              </li>

              <div class="divider my-1"></div>

              <!-- Common -->
              <li><a routerLink="/cart">Modifier profil</a></li>

              <!-- ADMIN -->
              <ng-container *ngIf="user.role === 'ADMIN'">
                <li><a routerLink="/admin-dashboard">Dashboard</a></li>
                <li><a routerLink="/cart">Shops approuvés</a></li>
                <li><a routerLink="/cart">Shops en attente</a></li>
                <li><a routerLink="/cart">Shops bannis</a></li>
                <li><a routerLink="/cart">Commandes expédiées</a></li>
              </ng-container>

              <!-- VENDEUR -->
              <ng-container *ngIf="user.role === 'VENDEUR'">
                <li><a routerLink="/shop">Créer un Shop</a></li>
                <li><a routerLink="/cart">Mes shops</a></li>
                <li><a routerLink="/cart">Commandes récentes</a></li>
                <li><a routerLink="/cart">En préparation</a></li>
              </ng-container>

              <!-- ACHETEUR (DEFAULT) -->
              <ng-container *ngIf="user.role !== 'ADMIN' && user.role !== 'VENDEUR'">
                <li><a routerLink="/favorite">Favoris</a></li>
                <li><a routerLink="/cart">Panier</a></li>
                <li><a routerLink="/cart">Historique</a></li>
                <li><a routerLink="/cart">Factures</a></li>
              </ng-container>

              <div class="divider my-1"></div>

              <li>
                <button class="btn btn-error btn-sm w-full" type="button" (click)="logout()">
                  Se déconnecter
                </button>
              </li>
            </ul>

          </div>
        </div>
      </div>

      <!-- Not logged in -->
<div *ngIf="!user && !loading"
     class="navbar bg-base-100 shadow-sm sticky top-0 z-50 w-full rounded-none border-0">
        <div class="flex-1">
          <a routerLink="/" class="btn btn-ghost text-xl">RigCraftor</a>
        </div>
        <div class="flex-none">
          <a routerLink="/" class="btn btn-outline">Se connecter</a>
        </div>
      </div>

    </div>
  `
})
export class ProfilePage implements OnInit {
  user: any = null;
  loading = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: BaseService<any>
  ) {}

  ngOnInit() {
    const cached = this.auth.getUser();
    if (cached) {
      this.user = cached;
      this.loading = false;
      return;
    }

    this.auth.getMe().subscribe({
      next: (user: any) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  getImageUrl(value: string): string {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    return `${this.service['api'].replace('/api/', '/')}${value}`;
  }

  logout() {
    this.auth.logout().subscribe(() => {
      location.href = '/';
    });
  }
}