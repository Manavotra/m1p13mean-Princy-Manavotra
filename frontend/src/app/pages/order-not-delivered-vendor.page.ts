// pages/order-not-delivered-vendor.page.ts
// Filtre : commandes en cours (status !== LIVREE) ET contenant au moins un article
//          d'une boutique appartenant à l'utilisateur connecté (VENDEUR)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { BaseService } from '../services/base.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <hr>
    <h2>🚚 Commandes en cours — Mes boutiques</h2>
    <p *ngIf="loading">Chargement...</p>

    <ng-container *ngIf="!loading">

      <p *ngIf="vendorShopIds.length === 0" style="color:#f59e0b;">
        ⚠️ Aucune boutique approuvée trouvée pour votre compte.
      </p>

      <ng-container *ngIf="vendorShopIds.length > 0">
        <p>{{ items.length }} commande(s) en cours pour vos boutiques</p>

        <!-- Formulaire d'édition via GenericList (sans table, table manuelle ci-dessous) -->
        <app-generic-list
          endpoint="orders"
          [fields]="fields"
          [searchFields]="searchFields"
          [showTable]="false">
        </app-generic-list>

        <!-- Table manuelle filtrée -->
        <table border="1" style="width:100%; border-collapse:collapse; margin-top:12px;">
          <tr style="background:#f3f4f6;">
            <th>Acheteur</th>
            <th>Statut</th>
            <th>Boutique(s) concernée(s)</th>
            <th>Montant (Ar)</th>
            <th>Date</th>
          </tr>
          <tr *ngFor="let o of items">
            <td>{{ o.customer?.name || o.customer }}</td>
            <td>{{ o.status }}</td>
            <td>{{ getOrderShops(o) }}</td>
            <td>{{ o.totalAmount | number }}</td>
            <td>{{ o.createdAt | date:'dd/MM/yyyy' }}</td>
          </tr>
        </table>
      </ng-container>

    </ng-container>
  `
})
export class OrderNotDeliveredVendorPage implements OnInit {

  items: any[] = [];
  vendorShopIds: string[] = [];
  loading = true;

  fields = [
    { name: 'customer',      label: 'Acheteur',          type: 'relation', endpoint: 'users' },
    { name: 'status',        label: 'Statut',            type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
    { name: 'lieuLivraison', label: 'Lieu de livraison', type: 'nested', fields: [
        { name: 'lieu',          label: 'Lieu',    type: 'text' },
        { name: 'repere_adress', label: 'Repère',  type: 'text' }
    ]},
    { name: 'items', label: 'Articles', type: 'subdocument', fields: [
        { name: 'product',   label: 'Produit',   type: 'relation', endpoint: 'products' },
        { name: 'shop',      label: 'Boutique',  type: 'relation', endpoint: 'shops' },
        { name: 'quantity',  label: 'Quantité',  type: 'number' },
        { name: 'unitPrice', label: 'Prix (Ar)', type: 'number' }
    ]},
    { name: 'totalAmount', label: 'Montant (Ar)', type: 'number' }
  ];

  searchFields = [
    { name: 'customer', label: 'Acheteur', type: 'relation', endpoint: 'users' },
    { name: 'status',   label: 'Statut',   type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE'] }
  ];

  constructor(
    private service: BaseService<any>,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.loadForVendor(user._id);
    } else {
      this.auth.getMe().subscribe({
        next: (u: any) => { this.auth.setUser(u); this.loadForVendor(u._id); },
        error: () => { this.loading = false; this.router.navigate(['/login']); }
      });
    }
  }

  private loadForVendor(userId: string) {
    // Étape 1 : récupère les shops du vendeur connecté
    this.service.getAll('shops').subscribe({
      next: (allShops: any[]) => {
        // Filtre côté frontend : shops dont owner._id ou owner === userId
        const myShops = allShops.filter((s: any) => {
          const ownerId = s.owner?._id ?? s.owner;
          return ownerId === userId;
        });

        this.vendorShopIds = myShops.map((s: any) => s._id);

        if (this.vendorShopIds.length === 0) {
          this.loading = false;
          return;
        }

        // Étape 2 : récupère toutes les commandes et filtre côté frontend
        this.service.getAll('orders').subscribe({
          next: (allOrders: any[]) => {
            this.items = allOrders.filter((order: any) => {
              // Condition 1 : pas livrée
              if (order.status === 'LIVREE') return false;

              // Condition 2 : au moins un item appartient à une boutique du vendeur
              const orderShopIds = (order.items || []).map((item: any) =>
                item.shop?._id ?? (typeof item.shop === 'string' ? item.shop : null)
              ).filter(Boolean);

              return orderShopIds.some((shopId: string) =>
                this.vendorShopIds.includes(shopId)
              );
            });

            this.loading = false;
          },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  /** Retourne les noms des boutiques du vendeur présentes dans la commande */
  getOrderShops(order: any): string {
    const shops = (order.items || [])
      .map((item: any) => {
        const shopId = item.shop?._id ?? (typeof item.shop === 'string' ? item.shop : null);
        if (!shopId || !this.vendorShopIds.includes(shopId)) return null;
        return item.shop?.name ?? shopId;
      })
      .filter((name: string | null) => name !== null);

    // Dédoublonne
    return [...new Set(shops)].join(', ') || '—';
  }
}