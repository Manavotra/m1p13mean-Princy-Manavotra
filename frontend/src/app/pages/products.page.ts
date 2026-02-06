import { Component } from '@angular/core';
import { GenericListComponent } from '../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [GenericListComponent],
  template: `
    <h2>Products</h2>
    <app-generic-list
      endpoint="http://localhost:3000/api/products"
      [fields]="['label','price','stock']">
    </app-generic-list>
  `
})
export class ProductsPage {}
