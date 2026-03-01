import { Component } from '@angular/core';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';

import { ActivatedRoute } from '@angular/router';



@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Edit User</h2>
    <app-generic-list
      endpoint="users"
      [fields]="fields"
      [searchFields]="searchFields"

      [showTable]="false"
      [showSearch]="false"

      [editingId]="id"


      [canEdit]="true"
      [canDelete]="true"
      [canAdd]="true"

      redirectAfterSuccess="/users">
    </app-generic-list>
  `
})
export class UsersEditPage {

  id!: string;

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
  }

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
