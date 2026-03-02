// pages/order-delivered.page.ts
// Filtre : status = LIVREE (toutes boutiques)
import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { ProfilePage } from './profile.page';

@Component({
  standalone: true,
  imports: [GenericListComponent, ProfilePage],
  template: `
    <app-profile></app-profile>
    <hr>
    <h2>✅ Commandes livrées</h2>
    <app-generic-list
      endpoint="orders"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="{ status: 'LIVREE' }"
      [showForm]="false">
    </app-generic-list>
  `
})
export class OrderDeliveredPage {
  fields = [
    { name: 'customer',      label: 'Acheteur',          type: 'relation', endpoint: 'users' },
    { name: 'status',        label: 'Statut',            type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
    { name: 'lieuLivraison', label: 'Lieu de livraison', type: 'nested', fields: [
        { name: 'lieu', label: 'Lieu', type: 'text' },
        { name: 'repere_adress', label: 'Repère', type: 'text' }
    ]},
    { name: 'items', label: 'Articles', type: 'subdocument', fields: [
        { name: 'product',   label: 'Produit',            type: 'relation', endpoint: 'products' },
        { name: 'shop',      label: 'Boutique',           type: 'relation', endpoint: 'shops' },
        { name: 'quantity',  label: 'Quantité',           type: 'number' },
        { name: 'unitPrice', label: 'Prix unitaire (Ar)', type: 'number' }
    ]},
    { name: 'totalAmount', label: 'Montant total (Ar)', type: 'number' }
  ];
  searchFields = [
    { name: 'customer', label: 'Acheteur', type: 'relation', endpoint: 'users' },
    { name: 'items', type: 'subdocument', fields: [
        { name: 'shop', label: 'Boutique', type: 'relation', endpoint: 'shops' }
    ]},
    { name: 'totalAmount', label: 'Montant (Ar)', type: 'number' }
  ];
}