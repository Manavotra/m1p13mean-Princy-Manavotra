import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Products</h2>
    <app-generic-list
      endpoint="products"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class ProductsPage {
  fields = [
    { name: 'label', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'stock', type: 'number' }
  ];
  searchFields = [
    { name: 'label', type: 'text' },
    { name: 'price', type: 'number' },   // 🔥 number search
    { name: 'stock', type: 'number' }
  ];

}
