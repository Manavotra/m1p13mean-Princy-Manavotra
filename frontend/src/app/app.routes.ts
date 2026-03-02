import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { UserPage } from './pages/user.page';
import { ShopPage } from './pages/shop.page';
import { ProductPage } from './pages/product.page';
import { OrderPage } from './pages/order.page';
import { FavoritePage } from './pages/favorite.page';
import { DiscountPage } from './pages/discount.page';
import { CategoryPage } from './pages/category.page';
import { CartPage } from './pages/cart.page';

import { UserListPage } from './pages/users/users-list.page';
import { UserCreatePage } from './pages/users/users-create.page';
import { UsersEditPage } from './pages/users/users-edit.page';

import { LoginPage  } from './pages/login.page';
import { ProfilePage  } from './pages/profile.page';


import { AdminLayout } from '../app/layouts/admin-layout/admin-layout';
import { ShopLayout } from '../app/layouts/shop-layout/shop-layout';
import { CustomerLayout } from '../app/layouts/customer-layout/customer-layout';


import { OrderAllPage }         from './pages/order-all.page';
import { OrderDeliveredPage }   from './pages/order-delivered.page';
import { OrderNotDeliveredPage} from './pages/order-not-delivered.page';
import { OrderMyDeliveredPage } from './pages/order-my-delivered.page';
import { AdminDashboardPage }   from './pages/admin-dashboard.page';

import { ProductGridComponent } from './components/product-grid/product-grid.component';

export const routes: Routes = [

  // CUSTOMER LAYOUT
  {
    path: '',
    component: CustomerLayout,
    children: [
      { path: '', component: ProductGridComponent },

      { path: 'home', component: HomeComponent },
      { path: 'user', component: UserPage },
      { path: 'shop', component: ShopPage },
      { path: 'product', component: ProductPage },
      // Mes commandes (utilisateur connecté) + suppression panier après commande
      { path: 'order', component: OrderPage },
      { path: 'favorite', component: FavoritePage },
      { path: 'discount', component: DiscountPage },
      { path: 'category', component: CategoryPage },
      { path: 'cart', component: CartPage },

      { path: 'users', component: UserListPage },
      { path: 'users/create', component: UserCreatePage },
      { path: 'users/:id/edit', component: UsersEditPage },

      { path: 'login', component: LoginPage },
      { path: 'profile', component: ProfilePage },

      // Toutes les commandes — sans filtre (admin)
      { path: 'order-all',           component: OrderAllPage },

      // Commandes LIVRÉES uniquement (toutes)
      { path: 'order-delivered',     component: OrderDeliveredPage },

      // Commandes en cours (tout sauf LIVREE)
      { path: 'order-not-delivered', component: OrderNotDeliveredPage },

      // Mes commandes LIVRÉES (utilisateur connecté)
      { path: 'order-my-delivered',  component: OrderMyDeliveredPage },

      // Dashboard admin
      { path: 'admin-dashboard',     component: AdminDashboardPage },

    ]
  },

  // ADMIN LAYOUT
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      // { path: 'users', component: UsersPage },
      // { path: 'categories', component: CategoriesPage },
      // { path: 'subcategories', component: SubCategoriesPage },
      // { path: 'projects', component: ProjectsPage },
      // { path: 'invoices', component: InvoicesPage },
      // { path: 'authors', component: AuthorsPage },
      // { path: 'books', component: BooksPage },
      // { path: 'warehouses', component: WarehousesPage },
      // { path: 'tasks', component: TasksPage }
    ]
  },

  // SHOP LAYOUT
  {
    path: 'shop',
    component: ShopLayout,
    children: [
      // { path: 'products', component: ProductsPage },
      // { path: 'orders', component: OrdersPage }
    ]
  }

];