import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {

  @Input() role!: string;
  @Input() drawerId!: string;

  menus = {
    admin: [
      { label: 'Dashboard', link: '/admin/dashboard', icon: '📊' },
      { label: 'Boutiques', link: '/admin/shops', icon: '🏬' },
      { label: 'Acheteurs', link: '/admin/customers', icon: '👥' },
      { label: 'Catégories', link: '/admin/categories', icon: '📂' }
    ],
    shop: [
      { label: 'Dashboard', link: '/shop/dashboard', icon: '📊' },
      { label: 'Produits', link: '/shop/products', icon: '📦' },
      { label: 'Commandes', link: '/shop/orders', icon: '🧾' }
    ],
    customer: [
      { label: 'Accueil', link: '/', icon: '🏠' },
      { label: 'Boutiques', link: '/shops', icon: '🏬' },
      { label: 'Panier', link: '/cart', icon: '🛒' },
      { label: 'Commandes', link: '/orders', icon: '📦' }
    ]
  };

  getMenu() {
    return this.menus[this.role as keyof typeof this.menus] || [];
  }

}