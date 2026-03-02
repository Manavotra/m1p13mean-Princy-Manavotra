// pages/order.page.ts
// Filtre : commandes de l'utilisateur connecté
// Supprime le panier après création d'une commande
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <h2>📦 Mes Commandes</h2>
    <p *ngIf="loading">Chargement...</p>
    <app-generic-list
      *ngIf="!loading && fields.length"
      endpoint="orders"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="extraParams"
      [prefillData]="prefillData"
      (afterSubmit)="onOrderCreated()">
    </app-generic-list>
  `
})
export class OrderPage implements OnInit {
  fields: any[] = [];
  searchFields: any[] = [];
  extraParams: any = {};
  prefillData: any = null;
  loading = true;

  private cartId: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: BaseService<any>
  ) {}

  ngOnInit() {
    const cached = this.auth.getUser();
    if (cached) { this.init(cached); }
    else {
      this.auth.getMe().subscribe({
        next: (u: any) => { this.auth.setUser(u); this.init(u); },
        error: () => { this.loading = false; this.router.navigate(['/login']); }
      });
    }
  }

  private init(user: any) {
    const userId = user?._id;
    const isAdmin = user?.role === 'ADMIN';

    // Filtre : utilisateur connecté (admin voit tout)
    this.extraParams = (!isAdmin && userId) ? { customer: userId } : {};

    const prefill    = history.state?.prefill || null;
    this.cartId      = history.state?.cartId  || null;
    if (prefill) this.prefillData = prefill;

    this.fields = FIELDS(userId, isAdmin, prefill);
    this.searchFields = SEARCH_FIELDS();
    this.loading = false;
  }

  /** Supprime le panier source après création réussie de la commande */
  onOrderCreated() {
    if (!this.cartId) return;
    this.service.delete('carts', this.cartId).subscribe({
      next: () => { console.log('🛒 Panier supprimé:', this.cartId); this.cartId = null; },
      error: (e: any) => console.error('Erreur suppression panier:', e)
    });
  }
}

// ─── Champs partagés ───────────────────────────────────────────────────────

function FIELDS(userId?: string, isAdmin = false, prefill?: any) {
  return [
    { name: 'customer', label: 'Acheteur', type: 'relation', endpoint: 'users',
      defaultValue: userId, locked: !isAdmin },
    { name: 'status', label: 'Statut', type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'], defaultValue: 'NOUVELLE' },
    { name: 'lieuLivraison', label: 'Lieu de livraison', type: 'nested', fields: [
        { name: 'lieu',          label: 'Lieu',           type: 'text' },
        { name: 'repere_adress', label: 'Repère adresse', type: 'text' }
    ]},
    { name: 'items', label: 'Articles', type: 'subdocument', fields: [
        { name: 'product',   label: 'Produit',            type: 'relation', endpoint: 'products', locked: !!prefill },
        { name: 'shop',      label: 'Boutique',           type: 'relation', endpoint: 'shops',    locked: !!prefill },
        { name: 'quantity',  label: 'Quantité',           type: 'number',   locked: !!prefill },
        { name: 'unitPrice', label: 'Prix unitaire (Ar)', type: 'number',   locked: !!prefill }
    ]},
    { name: 'totalAmount', label: 'Montant total (Ar)', type: 'number',
      defaultValue: prefill?.totalAmount || null, locked: !!prefill }
  ];
}

function SEARCH_FIELDS() {
  return [
    { name: 'customer', label: 'Acheteur', type: 'relation', endpoint: 'users' },
    { name: 'status',   label: 'Statut',   type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
    { name: 'lieuLivraison', type: 'nested', fields: [
        { name: 'lieu', label: 'Lieu', type: 'text' }
    ]},
    { name: 'items', type: 'subdocument', fields: [
        { name: 'product', label: 'Produit',  type: 'relation', endpoint: 'products' },
        { name: 'shop',    label: 'Boutique', type: 'relation', endpoint: 'shops' }
    ]},
    { name: 'totalAmount', label: 'Montant (Ar)', type: 'number' }
  ];
}