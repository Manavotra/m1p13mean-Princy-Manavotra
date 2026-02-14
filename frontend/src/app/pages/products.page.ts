import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Products</h2>
    <app-generic-list
      endpoint="products"
      [fields]="fields">
    </app-generic-list>
  `
})
export class ProductsPage {
  fields = [
    { name: 'label', type: 'text' },
    { name: 'price', type: 'text' },
    { name: 'stock', type: 'text' }
  ];
}
