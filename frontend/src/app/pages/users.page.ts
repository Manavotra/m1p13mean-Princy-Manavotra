import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Users</h2>
    <app-generic-list
      endpoint="http://localhost:3000/api/users"
      [fields]="['name','email','role']">
    </app-generic-list>
  `
})
export class UsersPage {}
