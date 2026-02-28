import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Shop</h2>
    <app-generic-list
      endpoint="shops"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})

export class ShopPage {
  fields = [
    { name: 'name', type: 'text' },
    { name: 'logo', type: 'image' },
    { name: 'description', type: 'text' },
    { name: 'owner', type: 'relation', endpoint: 'users' },
    { name: 'status', type: 'select', options: ['EN_ATTENTE', 'APPROUVE', 'BANNI'] }

  ];

  searchFields = [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'owner', type: 'relation', endpoint: 'users' },
    { name: 'status', type: 'select', options: ['EN_ATTENTE', 'APPROUVE', 'BANNI'] }

  ];
}
