import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Projects</h2>
    <app-generic-list
      endpoint="projects"
      [fields]="fields"
      [searchFields]="searchFields">
    </app-generic-list>
  `
})
export class ProjectsPage {

  fields = [
    { name: 'name', type: 'text' },
    // { name: 'status', type: 'select', options: ['draft', 'active', 'completed'] },
    { name: 'tags', type: 'array' } // tableau simple
  ];

    searchFields = [
    { name: 'name', type: 'text' },
    // { name: 'status', type: 'select', options: ['draft', 'active', 'completed'] },
    { name: 'tags', type: 'array' } // tableau simple
  ];
}
