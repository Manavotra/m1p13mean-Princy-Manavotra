// pages/historique.page.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    <h2>Mes commandes</h2>
    <p *ngIf="loading">Chargement...</p>

    <app-generic-list
      *ngIf="!loading"
      endpoint="orders"
      [fields]="fields"
      [searchFields]="searchFields"
      [extraParams]="extraParams"
      [showTable]="true"
      [showSearch]="true"
      [showForm]="false"
      
      [canEdit]="false"
      [canDelete]="false">
    </app-generic-list>
  `
})
export class HistoriquePage implements OnInit {

  loading = true;
  extraParams: any = {};

  fields = [
    { name: 'customer',      label: 'Acheteur',          type: 'relation', endpoint: 'users', locked: true },
    { name: 'status',        label: 'Statut',            type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
    { name: 'lieuLivraison', label: 'Lieu de livraison', type: 'nested', fields: [
        { name: 'lieu',          label: 'Lieu',   type: 'text' },
        { name: 'repere_adress', label: 'Repere', type: 'text' }
    ]},
    { name: 'items', label: 'Articles', type: 'subdocument', fields: [
        { name: 'product',   label: 'Produit',   type: 'relation', endpoint: 'products' },
        { name: 'shop',      label: 'Boutique',  type: 'relation', endpoint: 'shops' },
        { name: 'quantity',  label: 'Quantite',  type: 'number' },
        { name: 'unitPrice', label: 'Prix (Ar)', type: 'number' }
    ]},
    { name: 'totalAmount', label: 'Montant (Ar)', type: 'number' }
  ];

  searchFields = [
    { name: 'status', label: 'Statut', type: 'select',
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.init(user);
    } else {
      this.auth.getMe().subscribe({
        next: (u: any) => {
          this.auth.setUser(u);
          this.init(u);
        },
        error: (err: any) => {
          console.error('getMe() failed:', err);
          this.loading = false;
          this.router.navigate(['/login']);
        }
      });
    }
  }

  private init(user: any) {
    this.extraParams = { customer: user._id };
    // loading = false APRÈS avoir défini extraParams,
    // + detectChanges() pour forcer Angular à re-render hors zone
    this.loading = false;
    this.cdr.detectChanges();
  }
}