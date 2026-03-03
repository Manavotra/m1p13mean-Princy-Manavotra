import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
      <div class="card bg-base-100 shadow p-6 space-y-1">
        <h1 class="text-2xl font-bold">Gérer les categories des produits de votre commerce</h1>
        <br>
    </div>
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
