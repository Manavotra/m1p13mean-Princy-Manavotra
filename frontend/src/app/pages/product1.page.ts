import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Product</h2>
    <app-generic-list
      endpoint="products"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class Product1Page {
  fields = [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'stock', type: 'number' },
    { name: 'image', type: 'image' },
    { name: 'shop', type: 'relation', endpoint: 'shops' },
    { name: 'category', type: 'relation', endpoint: 'categories' },
    { name: 'status', type: 'select', options: ['DISPONIBLE', 'INACTIF', 'BANNI'] }


  ];
  searchFields = [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'range-number' },

    // { name: 'price', type: 'number' },
    { name: 'stock', type: 'number' },
    { name: 'shop', type: 'relation', endpoint: 'shops' },
    { name: 'category', type: 'relation', endpoint: 'categories' },
    { name: 'status', type: 'select', options: ['DISPONIBLE', 'INACTIF', 'BANNI'] }


    // // 🔥 SUBDOCUMENT RANGE NUMBER
    // { name: 'price', type: 'range-number' },

    // // 🔥 SUBDOCUMENT RANGE DATE
    // { name: 'date', type: 'range-date' }
  ];

}
