import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { UsersPage } from './pages/users.page';
import { ProductsPage } from './pages/products.page';
import { CategoriesPage } from './pages/categories.page';
import { SubCategoriesPage } from './pages/subcategories.page';

import { ProjectsPage } from './pages/projects.page';
import { InvoicesPage } from './pages/invoices.page';
import { AuthorsPage } from './pages/authors.page';
import { BooksPage } from './pages/books.page';
import { WarehousesPage } from './pages/warehouses.page';
import { TasksPage } from './pages/tasks.page';

import { OrdersPage } from './pages/orders.page';

import { AdminLayout } from '../app/layouts/admin-layout/admin-layout';
import { ShopLayout } from '../app/layouts/shop-layout/shop-layout';
import { CustomerLayout } from '../app/layouts/customer-layout/customer-layout';


export const routes: Routes = [

  // CUSTOMER LAYOUT
  {
    path: '',
    component: CustomerLayout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductsPage },
      { path: 'orders', component: OrdersPage }
    ]
  },

  // ADMIN LAYOUT
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'users', component: UsersPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'subcategories', component: SubCategoriesPage },
      { path: 'projects', component: ProjectsPage },
      { path: 'invoices', component: InvoicesPage },
      { path: 'authors', component: AuthorsPage },
      { path: 'books', component: BooksPage },
      { path: 'warehouses', component: WarehousesPage },
      { path: 'tasks', component: TasksPage }
    ]
  },

  // SHOP LAYOUT
  {
    path: 'shop',
    component: ShopLayout,
    children: [
      { path: 'products', component: ProductsPage },
      { path: 'orders', component: OrdersPage }
    ]
  }

];