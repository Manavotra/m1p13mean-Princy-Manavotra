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

import { ShopAdminPage } from './pages/shop.admin.page';

import { OrderNotDeliveredVendorPage } from './pages/order-not-delivered-vendor.page';
import { HistoriquePage } from './pages/historique.page';

// import { AdminLayout } from '../app/layouts/admin-layout/admin-layout';
// import { ShopLayout } from '../app/layouts/shop-layout/shop-layout';
// import { CustomerLayout } from '../app/layouts/customer-layout/customer-layout';


import { OrderAllPage }         from './pages/order-all.page';
import { OrderDeliveredPage }   from './pages/order-delivered.page';
import { OrderNotDeliveredPage} from './pages/order-not-delivered.page';
import { OrderMyDeliveredPage } from './pages/order-my-delivered.page';
import { AdminDashboardPage }   from './pages/admin-dashboard.page';

import { FacturePage } from './pages/facture.page';
export const routes: Routes = [
   { path: '', component: LoginPage },
      { path: 'users/create', component: UserCreatePage },


      { path: 'user', component: UserPage },
      { path: 'order_pending', component: OrderNotDeliveredVendorPage },
      { path: 'profile', component: ProfilePage },
      { path: 'users', component: UserListPage },
      { path: 'discount', component: DiscountPage },


      // =============================
      // VENDEUR - ACHETEUR
      // =============================
      { path: 'product', component: ProductPage },
      { path: 'users/:id/edit', component: UsersEditPage },


      // Mes commandes (utilisateur connecté) + suppression panier après commande
      { path: 'order', component: OrderPage },
      { path: 'cart', component: CartPage },




      // Commandes LIVRÉES uniquement (toutes)
      { path: 'order-delivered',     component: OrderDeliveredPage },

      // Commandes en cours (tout sauf LIVREE)
      { path: 'order-not-delivered', component: OrderNotDeliveredPage },

      // Mes commandes LIVRÉES (utilisateur connecté) facture
      { path: 'order-my-delivered',  component: OrderMyDeliveredPage },


      // =============================
      // ACHETEUR
      // =============================

      { path: 'facture', component: FacturePage },

      { path: 'historique', component: HistoriquePage },


      { path: 'favorite', component: FavoritePage },



      // =============================
      // VENDEUR
      // =============================




      { path: 'shop', component: ShopPage },

      // =============================
      // ADMIN
      // =============================
      
      { path: 'category', component: CategoryPage },

      { path: 'shop-admin', component: ShopAdminPage },

      // Toutes les commandes — sans filtre (admin)
      { path: 'order-all',           component: OrderAllPage },

      // Dashboard admin
      { path: 'admin-dashboard',     component: AdminDashboardPage },
];
