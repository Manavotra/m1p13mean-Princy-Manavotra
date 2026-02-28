import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Category</h2>
    <app-generic-list
      endpoint="categories"
      [fields]="fields"
      [searchFields]="searchFields">

    </app-generic-list>
  `
})

export class CategoryPage {
  fields = [
    { name: 'name', type: 'text' }
  ];

  searchFields = [
    { name: 'name', type: 'text' }

  ];
}
