import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Orders</h2>
    <app-generic-list
      endpoint="orders"
      [fields]="fields">
    </app-generic-list>
  `
})
export class OrdersPage {

  fields = [

    {
      name: 'customer',
      type: 'relation',
      endpoint: 'users'
    },

    {
      name: 'status',
      type: 'select',
      options: ['pending', 'confirmed', 'shipped', 'delivered']
    },

    {
      name: 'shippingAddress',
      type: 'nested',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'zipCode', type: 'text' },
        { name: 'country', type: 'text' }
      ]
    },

    {
      name: 'notes',
      type: 'array'
    },

    {
      name: 'products',
      type: 'subdocument',
      fields: [
        {
          name: 'product',
          type: 'relation',
          endpoint: 'products'
        },
        { name: 'quantity', type: 'number' },
        { name: 'unitPrice', type: 'number' }
      ]
    }

  ];

}
