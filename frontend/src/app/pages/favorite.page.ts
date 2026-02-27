import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Favorite</h2>
    <app-generic-list
      endpoint="favorites"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class FavoritePage {

  fields = [
    { name: 'user', type: 'relation', endpoint: 'users' },
    { name: 'product', type: 'relation', endpoint: 'products' }

  ];

  searchFields = [
    { name: 'user', type: 'relation', endpoint: 'users' },
    { name: 'product', type: 'relation', endpoint: 'products' }

  ];
}