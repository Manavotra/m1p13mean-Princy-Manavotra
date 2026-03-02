// pages/order-not-delivered.page.ts
// Filtre : toutes les commandes SAUF status LIVREE
// Note: le backend doit supporter $ne via QueryBuilder, sinon filtrer côté frontend
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { BaseService } from '../services/base.service';
import { ProfilePage } from './profile.page';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent, ProfilePage],
  template: `
    <app-profile></app-profile>
    <hr>
    <h2>🚚 Commandes en cours</h2>
    <p *ngIf="loading">Chargement...</p>
    <ng-container *ngIf="!loading">
      <!-- Affiche la liste filtrée manuellement -->
      <p>{{ items.length }} commande(s) en cours</p>
      <app-generic-list
        endpoint="orders"
        [fields]="fields"
        [searchFields]="searchFields"
        [showTable]="false">
      </app-generic-list>
      <!-- Table manuelle pour les items filtrés -->
      <table border="1" style="width:100%; border-collapse:collapse; margin-top:12px;">
        <tr style="background:#f3f4f6;">
          <th>Acheteur</th><th>Statut</th><th>Montant (Ar)</th><th>Date</th>
        </tr>
        <tr *ngFor="let o of items">
          <td>{{ o.customer?.name || o.customer }}</td>
          <td>{{ o.status }}</td>
          <td>{{ o.totalAmount | number }}</td>
          <td>{{ o.createdAt | date:'dd/MM/yyyy' }}</td>
        </tr>
      </table>
    </ng-container>
  `
})
export class OrderNotDeliveredPage implements OnInit {
  items: any[] = [];
  loading = true;

  fields = [
    { name: 'customer',      label: 'Acheteur',          type: 'relation', endpoint: 'users' },
    { name: 'status',        label: 'Statut',            type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
    { name: 'lieuLivraison', label: 'Lieu de livraison', type: 'nested', fields: [
        { name: 'lieu', label: 'Lieu', type: 'text' },
        { name: 'repere_adress', label: 'Repère', type: 'text' }
    ]},
    { name: 'items', label: 'Articles', type: 'subdocument', fields: [
        { name: 'product',   label: 'Produit',  type: 'relation', endpoint: 'products' },
        { name: 'shop',      label: 'Boutique', type: 'relation', endpoint: 'shops' },
        { name: 'quantity',  label: 'Quantité', type: 'number' },
        { name: 'unitPrice', label: 'Prix (Ar)', type: 'number' }
    ]},
    { name: 'totalAmount', label: 'Montant (Ar)', type: 'number' }
  ];
  searchFields = [
    { name: 'customer', label: 'Acheteur', type: 'relation', endpoint: 'users' },
    { name: 'status',   label: 'Statut',   type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE'] }
  ];

  constructor(private service: BaseService<any>) {}

  ngOnInit() {
    // Charge toutes les commandes et filtre côté frontend (status !== 'LIVREE')
    this.service.getAll('orders').subscribe({
      next: (data: any[]) => {
        this.items = data.filter((o: any) => o.status !== 'LIVREE');
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}