import { Component } from '@angular/core';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>User</h2>
    <app-generic-list
      endpoint="users"
      [fields]="fields"
      [searchFields]="searchFields"

      [showForm]="true"
      [showTable]="false"
      [showSearch]="false"

      [canEdit]="false"
      [canDelete]="false"
      [canAdd]="true"

      redirectAfterSuccess="/favorite">
    </app-generic-list>
  `
})
export class UserListPage {
  fields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'role', type: 'select', options: ['ADMIN', 'VENDEUR', 'ACHETEUR'] },
    { name: 'avatar', type: 'image' }

  ];

  searchFields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'role', type: 'select', options: ['ADMIN', 'VENDEUR', 'ACHETEUR'] }

  ];
}
