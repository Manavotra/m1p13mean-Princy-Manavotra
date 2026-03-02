// pages/cart.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <h2>🛒 Mon Panier</h2>
    <app-generic-list
      *ngIf="fields.length"
      endpoint="carts"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class CartPage implements OnInit {
  fields: any[] = [];

  searchFields = [
    { name: 'user', label: 'Utilisateur', type: 'relation', endpoint: 'users' },
    { name: 'items', type: 'subdocument', fields: [
        { name: 'product', label: 'Produit', type: 'relation', endpoint: 'products' }
      ]
    }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    const userId = user?._id;

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
          { name: 'product',  label: 'Produit',  type: 'relation', endpoint: 'products' },
          { name: 'quantity', label: 'Quantité', type: 'number' }
        ]
      }
    ];
  }
}