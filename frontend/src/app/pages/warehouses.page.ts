import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Warehouses</h2>
    <app-generic-list
      endpoint="warehouses"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class WarehousesPage {

  fields = [
    { name: 'name', type: 'text' },
    {
      name: 'location',
      type: 'nested',
      fields: [
        { name: 'address', type: 'text' },
        { name: 'city', type: 'text' }
      ]
    }
  ];

  searchFields = [
    { name: 'name', type: 'text' },
    {
      name: 'location',
      type: 'nested',
      fields: [
        { name: 'address', type: 'text' },
        { name: 'city', type: 'text' }
      ]
    }
  ];
}