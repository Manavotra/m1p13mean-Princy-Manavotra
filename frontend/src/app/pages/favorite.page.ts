// pages/favorite.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <h2>❤️ Mes Favoris</h2>
    <app-generic-list
      *ngIf="fields.length"
      endpoint="favorites"
      [fields]="fields"
      [searchFields]="searchFields"
      [filterParams]="filterParams">
    </app-generic-list>
  `
})
export class FavoritePage implements OnInit {
  fields: any[] = [];
  filterParams: any = {};

  searchFields = [
    { name: 'product', label: 'Produit', type: 'relation', endpoint: 'products' }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    const userId = user?._id;

    // Filtre automatique : uniquement les favoris de l'utilisateur connecté
    this.filterParams = { user: userId };

    this.fields = [
      {
        name: 'user',
        label: 'Utilisateur',
        type: 'relation',
        endpoint: 'users',
        defaultValue: userId,
        locked: true
      },
      { name: 'product', label: 'Produit', type: 'relation', endpoint: 'products' }
    ];
  }
}