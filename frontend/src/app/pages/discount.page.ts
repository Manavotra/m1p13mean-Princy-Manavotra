import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Discount</h2>
    <app-generic-list
      endpoint="discounts"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class DiscountPage {

  fields = [
    { name: 'product', type: 'relation', endpoint: 'products' },
    { name: 'type', type: 'select', options: ['POURCENTAGE', 'MONTANT_FIXE'] },
    { name: 'value', type: 'number' },
    { name: 'status', type: 'select', options: ['EFFECTIVE', 'INACTIVE'] }

  ];

  searchFields = [
    { name: 'product', type: 'relation', endpoint: 'products' },
    { name: 'type', type: 'select', options: ['POURCENTAGE', 'MONTANT_FIXE'] },
    { name: 'value', type: 'number' },
    { name: 'status', type: 'select', options: ['EFFECTIVE', 'INACTIVE'] }

  ];
}