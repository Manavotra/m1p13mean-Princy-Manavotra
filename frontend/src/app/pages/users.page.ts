import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Users</h2>
    <app-generic-list
      endpoint="users"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class UsersPage {
  fields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'manager', type: 'relation', endpoint: 'users' }
  ];

  searchFields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'manager', type: 'relation', endpoint: 'users' }

  ];
}
