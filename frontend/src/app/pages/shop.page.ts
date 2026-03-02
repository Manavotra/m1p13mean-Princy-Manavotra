// pages/shop.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <h2>Shop</h2>
    <app-generic-list
      *ngIf="fields.length"
      endpoint="shops"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class ShopPage implements OnInit {
  fields: any[] = [];

  searchFields = [
    { name: 'name',        label: 'Nom',         type: 'text' },
    { name: 'description', label: 'Description',  type: 'text' },
    { name: 'owner',       label: 'Propriétaire', type: 'relation', endpoint: 'users' },
    { name: 'status',      label: 'Statut',       type: 'select',
      options: ['EN_ATTENTE', 'APPROUVE', 'BANNI'] }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    const userId = user?._id;

    this.fields = [
      { name: 'name',        label: 'Nom de la boutique', type: 'text' },
      { name: 'logo',        label: 'Logo',               type: 'image' },
      { name: 'description', label: 'Description',        type: 'text' },
      {
        name: 'owner',
        label: 'Propriétaire',
        type: 'relation',
        endpoint: 'users',
        // Valeur par défaut = utilisateur connecté, champ verrouillé
        defaultValue: userId,
        locked: true
      },
      { name: 'status', label: 'Statut', type: 'select',
        options: ['EN_ATTENTE', 'APPROUVE', 'BANNI'] }
    ];
  }
}