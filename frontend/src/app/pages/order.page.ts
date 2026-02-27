import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Order</h2>
    <app-generic-list
      endpoint="orders"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class OrderPage {

  fields = [

    {
      name: 'customer',
      type: 'relation',
      endpoint: 'users'
    }, 
    { name: 'status', type: 'select', 
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
   
    {
      name: 'lieuLivraison',
      type: 'nested',
      fields: [
        { name: 'lieu', type: 'text' },
        { name: 'repere_adress', type: 'text' }
      ]
    },
    { name: 'items', type: 'subdocument', fields: [
        {
          name: 'product',
          type: 'relation',
          endpoint: 'products'
        },    
        {
          name: 'shop',
          type: 'relation',
          endpoint: 'shops'
        },
        { name: 'quantity', type: 'number' },
        { name: 'unitPrice', type: 'number' },

      ]
    },
    { name: 'totalAmount', type: 'number' },



  ];

  searchFields = [
    {
      name: 'customer',
      type: 'relation',
      endpoint: 'users'
    }, 
    { name: 'status', type: 'select', 
      options: ['NOUVELLE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] },
   
    {
      name: 'lieuLivraison',
      type: 'nested',
      fields: [
        { name: 'lieu', type: 'text' },
        { name: 'repere_adress', type: 'text' }
      ]
    },
    { name: 'items', type: 'subdocument', fields: [
        {
          name: 'product',
          type: 'relation',
          endpoint: 'products'
        },    
        {
          name: 'shop',
          type: 'relation',
          endpoint: 'shops'
        },
        // { name: 'quantity', type: 'number' },
        // { name: 'unitPrice', type: 'number' },

      ]
    },
    { name: 'totalAmount', type: 'number' },


];

}
