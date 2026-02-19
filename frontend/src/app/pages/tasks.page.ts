import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Tasks</h2>
    <app-generic-list
      endpoint="tasks"
      [fields]="fields">
    </app-generic-list>
  `
})
export class TasksPage {

  fields = [
    { name: 'title', type: 'text' },
    { name: 'status', type: 'select', options: ['Todo', 'Doing', 'Done'] }
    // { name: 'assignedTo', type: 'relation', endpoint: 'users' }
  ];
}