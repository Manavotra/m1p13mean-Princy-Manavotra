// pages/product.page.ts
import { Component } from '@angular/core';
import { ProductGridComponent } from '../components/product-grid/product-grid.component';

@Component({
  standalone: true,
  imports: [ProductGridComponent],
  template: `
    <app-product-grid
      endpoint="products"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-product-grid>
  `
})
export class ProductPage {

  fields = [
    { name: 'name',        label: 'Nom du produit',      type: 'text' },
    { name: 'description', label: 'Description',          type: 'text' },
    { name: 'price',       label: 'Prix (€)',             type: 'number' },
    { name: 'stock',       label: 'Stock disponible',     type: 'number' },
    { name: 'image',       label: 'Photo du produit',     type: 'image' },
    { name: 'shop',        label: 'Boutique partenaire',  type: 'relation', endpoint: 'shops' },
    { name: 'category',    label: 'Catégorie',            type: 'relation', endpoint: 'categories' },
    { name: 'status',      label: 'Statut',               type: 'select',
      options: ['DISPONIBLE', 'INACTIF', 'BANNI'] }
  ];

  searchFields = [
    { name: 'name',        label: 'Nom',                  type: 'text' },
    { name: 'description', label: 'Description',          type: 'text' },
    { name: 'price',       label: 'Prix',                 type: 'range-number' },
    { name: 'stock',       label: 'Stock',                type: 'number' },
    { name: 'shop',        label: 'Boutique',             type: 'relation', endpoint: 'shops' },
    { name: 'category',    label: 'Catégorie',            type: 'relation', endpoint: 'categories' },
    { name: 'status',      label: 'Statut',               type: 'select',
      options: ['DISPONIBLE', 'INACTIF', 'BANNI'] }
  ];
}