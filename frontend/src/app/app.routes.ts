import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { UsersPage } from './pages/users.page';
import { ProductsPage } from './pages/products.page';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersPage },
  { path: 'products', component: ProductsPage }
];
