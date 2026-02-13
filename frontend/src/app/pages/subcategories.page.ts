import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Users</h2>
    <app-generic-list
      endpoint="subcategory"
      [fields]="fields">
    </app-generic-list>
  `
})

export class SubCategoriesPage {
  fields = [
    { name: 'name', type: 'text' },
    { name: 'category', type: 'relation', endpoint: 'category' }
  ];
}
