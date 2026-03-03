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
    <div class="card bg-base-100 shadow p-6 space-y-1">
      <h1 class="text-2xl font-bold">Mes Favoris</h1>
      <br>
    </div>
    <app-generic-list
      *ngIf="fields.length"
      endpoint="favorites"
      [fields]="fields"
      [searchFields]="searchFields"
      [showTable]="true"
      [showSearch]="false"
      [showForm]="false"
      
      [canEdit]="false"
      [canDelete]="true"
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

      { name: 'product', label: 'Produit', type: 'relation', endpoint: 'products' }
    ];
  }
}