// pages/order-my-delivered.page.ts
// Filtre : utilisateur connecté ET status = LIVREE
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';
import { ProfilePage } from './profile.page';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent, ProfilePage],
  template: `
    <app-profile></app-profile>
    <hr>
    <h2>✅ Mes Commandes Livrées</h2>
    <p *ngIf="loading">Chargement...</p>
    <app-generic-list
      *ngIf="!loading"
      endpoint="orders"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="extraParams"
      [showForm]="false">
    </app-generic-list>
  `
})
export class OrderMyDeliveredPage implements OnInit {
  extraParams: any = {};
  loading = true;

  fields = [
    { name: 'customer',      label: 'Acheteur',          type: 'relation', endpoint: 'users', locked: true },
    { name: 'status',        label: 'Statut',            type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
    { name: 'lieuLivraison', label: 'Lieu de livraison', type: 'nested', fields: [
        { name: 'lieu', label: 'Lieu', type: 'text' },
        { name: 'repere_adress', label: 'Repère', type: 'text' }
    ]},
    { name: 'items', label: 'Articles', type: 'subdocument', fields: [
        { name: 'product',   label: 'Produit',  type: 'relation', endpoint: 'products' },
        { name: 'quantity',  label: 'Quantité', type: 'number' },
        { name: 'unitPrice', label: 'Prix (Ar)', type: 'number' }
    ]},
    { name: 'totalAmount', label: 'Montant total (Ar)', type: 'number' }
  ];
  searchFields = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.extraParams = { customer: user._id, status: 'LIVREE' };
      this.loading = false;
    } else {
      this.auth.getMe().subscribe({
        next: (u: any) => {
          this.auth.setUser(u);
          this.extraParams = { customer: u._id, status: 'LIVREE' };
          this.loading = false;
        },
        error: () => this.router.navigate(['/login'])
      });
    }
  }
}