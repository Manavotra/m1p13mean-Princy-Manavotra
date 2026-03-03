// pages/cart.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
  
    <div class="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">

    <div class="card bg-base-100 shadow p-6 space-y-1">
      <h1 class="text-2xl font-bold">🛒 Mon Panier</h1>
      <p class="text-sm opacity-60">✏️ Aller directement en bas de la page,cliquer sur Modifier puis remonter, modifiez les quantités si vous le souhaitez, puis cliquez sur <strong>Passer commande pour commander.</strong></p>
      <br>
      <hr>

      <p class="text-sm opacity-60"><strong>Note:</strong>votre panier ne sera pas supprimer automatiquement si vous ne commandez pas, dans ce cas,si vous vouler faire une nouvelle commande supprimer d'abord le panier restant </p>
    </div>
  <p *ngIf="loading">Chargement...</p>
    <app-generic-list
      *ngIf="!loading && fields.length"
      endpoint="carts"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="extraParams"
      [editHint]="'✏️ Modifiez les quantités si vous le souhaitez, puis cliquez sur Passer commande'"
      [editActionLabel]="'🧾 Passer commande'"
      (editActionClicked)="goToOrder($event)">
    </app-generic-list>
  `
})
export class CartPage implements OnInit {
  fields: any[] = [];
  extraParams: any = {};
  loading = true;
  searchFields: any[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const cached = this.auth.getUser();
    if (cached) {
      this.initWithUser(cached);
    } else {
      this.auth.getMe().subscribe({
        next: (user: any) => { this.auth.setUser(user); this.initWithUser(user); },
        error: () => { this.loading = false; this.router.navigate(['/login']); }
      });
    }
  }

  private initWithUser(user: any) {
    const userId = user?._id;
    this.extraParams = userId ? { user: userId } : {};

    this.fields = [
      { name: 'user', label: 'Utilisateur', type: 'relation', endpoint: 'users',
        defaultValue: userId, locked: true },
      { name: 'items', label: 'Produits du panier', type: 'subdocument', fields: [
          { name: 'product',  label: 'Produit',   type: 'relation', endpoint: 'products', locked: true },
          { name: 'quantity', label: 'Quantité',  type: 'number' }
      ]}
    ];

    this.searchFields = [
      { name: 'user', label: 'Utilisateur', type: 'relation', endpoint: 'users' }
    ];

    this.loading = false;
  }

  goToOrder(cart: any) {
    const userId = this.auth.getUser()?._id;

    const items = (cart.items || []).map((i: any) => ({
      product:   i.product?._id  || i.product,
      shop:      i.product?.shop?._id || i.product?.shop || null,
      quantity:  i.quantity || 1,
      unitPrice: i.product?.price || 0
    }));

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + (i.unitPrice * i.quantity), 0
    );

    this.router.navigate(['/order'], {
      state: {
        cartId: cart._id,   // 🔥 Pour suppression après commande
        prefill: { customer: userId, items, totalAmount, status: 'NOUVELLE' }
      }
    });
  }
}