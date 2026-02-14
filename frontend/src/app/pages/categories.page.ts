import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Users</h2>
    <app-generic-list
      endpoint="category"
      [fields]="fields">
    </app-generic-list>
  `
})

export class CategoriesPage {
  fields = [
    { name: 'name', type: 'text' }
  ];
}
