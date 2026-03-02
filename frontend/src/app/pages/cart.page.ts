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
    <h2>🛒 Mon Panier</h2>

    <!-- Chargement session en cours -->
    <p *ngIf="loading">Chargement...</p>

    <app-generic-list
      *ngIf="!loading && fields.length"
      endpoint="carts"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="extraParams"
      [editHint]="'✏️ Modifiez la quantité si vous le souhaitez, puis cliquez sur Passer commande'"
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
    // Tente d'abord depuis le cache mémoire
    const cached = this.auth.getUser();
    if (cached) {
      this.initWithUser(cached);
    } else {
      // Refresh de page : restaure via cookie
      this.auth.getMe().subscribe({
        next: (user: any) => {
          this.auth.setUser(user);
          this.initWithUser(user);
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        }
      });
    }
  }

  private initWithUser(user: any) {
    const userId = user?._id;

    this.extraParams = userId ? { user: userId } : {};

    this.fields = [
      {
        name: 'user',
        label: 'Utilisateur',
        type: 'relation',
        endpoint: 'users',
        defaultValue: userId,
        locked: true
      },
      {
        name: 'items',
        label: 'Produits du panier',
        type: 'subdocument',
        fields: [
          {
            name: 'product',
            label: 'Produit',
            type: 'relation',
            endpoint: 'products',
            locked: true   // grisé : on ne change pas le produit, seulement la quantité
          },
          { name: 'quantity', label: 'Quantité', type: 'number' }
        ]
      }
    ];

    this.searchFields = [
      { name: 'user', label: 'Utilisateur', type: 'relation', endpoint: 'users' }
    ];

    this.loading = false;
  }

  /**
   * Construit une commande à partir du panier et redirige vers /order
   * en passant les données pré-remplies via state de navigation.
   */
  goToOrder(cart: any) {
    const userId = this.auth.getUser()?._id;

    // Calcule le total et construit les items de commande
    const items = (cart.items || []).map((i: any) => ({
      product: i.product?._id || i.product,
      shop:    i.product?.shop?._id || i.product?.shop || null,
      quantity: i.quantity || 1,
      unitPrice: i.product?.price || 0
    }));

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + (i.unitPrice * i.quantity), 0
    );

    // Pré-remplit la commande et navigue
    this.router.navigate(['/order'], {
      state: {
        prefill: {
          customer: userId,
          items,
          totalAmount,
          status: 'NOUVELLE'
        }
      }
    });
  }
}