import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';


@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Invoices</h2>
    <app-generic-list
      endpoint="invoices"
      [fields]="fields"
      [searchFields]="searchFields">

    </app-generic-list>
  `
})
export class InvoicesPage {

    fields = [
    { name: 'customer', type: 'text' },
    { name: 'items', type: 'subdocument', fields: [
        { name: 'description', type: 'text' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'date', type: 'date' }
        ]
    }
    ];

    searchFields = [
      { name: 'customer', type: 'text' },

      // 🔥 ROOT RANGE
      { name: 'createdAt', type: 'range-date' },

      {
        name: 'items',
        type: 'subdocument',
        fields: [
          { name: 'description', type: 'text' },
          { name: 'quantity', type: 'number' },

          // 🔥 SUBDOCUMENT RANGE NUMBER
          { name: 'price', type: 'range-number' },

          // 🔥 SUBDOCUMENT RANGE DATE
          { name: 'date', type: 'range-date' }
        ]
      }
    ];

}