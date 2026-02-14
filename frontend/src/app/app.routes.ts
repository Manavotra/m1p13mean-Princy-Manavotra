import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { UsersPage } from './pages/users.page';
import { ProductsPage } from './pages/products.page';
import { CategoriesPage } from './pages/categories.page';
import { SubCategoriesPage } from './pages/subcategories.page';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersPage },
  { path: 'products', component: ProductsPage },
  { path: 'categories', component: CategoriesPage },
  { path: 'subcategories', component: SubCategoriesPage }

];
