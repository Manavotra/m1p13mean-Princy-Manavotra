import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Books</h2>
    <app-generic-list
      endpoint="books"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class BooksPage {

  fields = [
    { name: 'title', type: 'text' },
    { name: 'author', type: 'relation', endpoint: 'authors' }
  ];

  searchFields = [
    { name: 'title', type: 'text' },
    { name: 'author', type: 'relation', endpoint: 'authors' }
  ];
}