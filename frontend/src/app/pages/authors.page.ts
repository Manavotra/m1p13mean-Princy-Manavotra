import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Authors</h2>
    <app-generic-list
      endpoint="authors"
      [fields]="fields">
    </app-generic-list>
  `
})
export class AuthorsPage {

  fields = [
    { name: 'name', type: 'text' }
    // { name: 'email', type: 'text' }
  ];
}