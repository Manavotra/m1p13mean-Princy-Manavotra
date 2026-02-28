import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Cart</h2>
    <app-generic-list
      endpoint="carts"
      [fields]="fields"
      [searchFields]="searchFields">

    </app-generic-list>
  `
})

export class CartPage {
  fields = [
    { name: 'user', type: 'relation', endpoint: 'users' },

    { name: 'items', type: 'subdocument', fields: [
        { name: 'product', type: 'relation', endpoint: 'products' },
        { name: 'quantity', type: 'number' }

      ]
    }
  ];

  searchFields = [
    { name: 'user', type: 'relation', endpoint: 'users' },
    { name: 'items', type: 'subdocument', fields: [
        { name: 'product', type: 'relation', endpoint: 'products' }
        // { name: 'product', type: 'relation', endpoint: 'products' },
        // { name: 'quantity', type: 'number' }

      ]
    }

  ];
}
