// pages/order.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <h2>📦 Commandes</h2>
    <p *ngIf="loading">Chargement...</p>

    <app-generic-list
      *ngIf="!loading && fields.length"
      endpoint="orders"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="extraParams"
      [prefillData]="prefillData">
    </app-generic-list>
  `
})
export class OrderPage implements OnInit {
  fields: any[] = [];
  searchFields: any[] = [];
  extraParams: any = {};
  prefillData: any = null;
  loading = true;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const cached = this.auth.getUser();
    if (cached) {
      this.initWithUser(cached);
    } else {
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
    const isAdmin = user?.role === 'ADMIN';

    // Admin voit toutes les commandes, client ne voit que les siennes
    this.extraParams = (!isAdmin && userId) ? { customer: userId } : {};

    // Récupère le prefill envoyé depuis cart.page via router state
    // history.state est disponible même après que getCurrentNavigation() soit null
    const prefill = history.state?.prefill || null;

    if (prefill) {
      this.prefillData = prefill;
    }

    this.fields = [
      {
        name: 'customer',
        label: 'Client',
        type: 'relation',
        endpoint: 'users',
        defaultValue: userId,
        locked: !isAdmin
      },
      {
        name: 'status',
        label: 'Statut',
        type: 'select',
        options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'],
        defaultValue: 'NOUVELLE'
      },
      {
        name: 'totalAmount',
        label: 'Montant total (Ar)',
        type: 'number',
        defaultValue: prefill?.totalAmount || null,
        locked: true
      },
      {
        name: 'lieuLivraison',
        label: 'Lieu de livraison',
        type: 'nested',
        fields: [
          { name: 'lieu',          label: 'Lieu',           type: 'text' },
          { name: 'repere_adress', label: 'Repère adresse', type: 'text' }
        ]
      },
      {
        name: 'items',
        label: 'Articles commandés',
        type: 'subdocument',
        fields: [
          { name: 'product',   label: 'Produit',             type: 'relation', endpoint: 'products', locked: true },
          { name: 'shop',      label: 'Boutique',            type: 'relation', endpoint: 'shops',    locked: true },
          { name: 'quantity',  label: 'Quantité',            type: 'number',   locked: true },
          { name: 'unitPrice', label: 'Prix unitaire (Ar)',  type: 'number',   locked: true }
        ]
      }
    ];

    this.searchFields = [
      { name: 'customer', label: 'Client', type: 'relation', endpoint: 'users' },
      { name: 'status',   label: 'Statut', type: 'select',
        options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] }
    ];

    this.loading = false;
  }
}