import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';


@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Invoices</h2>
    <app-generic-list
      endpoint="invoices"
      [fields]="fields">
    </app-generic-list>
  `
})
export class InvoicesPage {

  fields = [
    { name: 'customerName', type: 'text' },
    { name: 'lines', type: 'subdocument', fields: [
        { name: 'label', type: 'text' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' }
      ]
    }
  ];
}