import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../services/base.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif; background: #f4f7f6; min-height: 100vh;">
      <h2>Tableau de Bord Admin</h2>

      <div *ngIf="loading">Chargement des données...</div>

      <div *ngIf="!loading">
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          <div class="card">
            <small>Commandes Livrées</small>
            <h3>{{ totalOrders }}</h3>
          </div>
          <div class="card">
            <small>Chiffre d'Affaires</small>
            <h3>{{ totalRevenue | number }} Ar</h3>
          </div>
          <div class="card">
            <small>Articles Vendus</small>
            <h3>{{ totalItemsSold }}</h3>
          </div>
        </div>

        <div class="card">
          <h3>Top 5 Produits les plus vendus</h3>
          <div *ngFor="let p of topProducts; let i = index" style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>{{ i + 1 }}. {{ p.name }}</span>
              <span><strong>{{ p.qty }}</strong> vendus</span>
            </div>
            <div style="background: #eee; height: 10px; border-radius: 5px;">
              <div [style.width.%]="(p.qty / topProducts[0].qty) * 100" 
                   style="background: #4f46e5; height: 100%; border-radius: 5px;"></div>
            </div>
          </div>
          <p *ngIf="topProducts.length === 0">Aucune donnée de vente.</p>
        </div>

        <div class="card" style="margin-top: 20px;">
          <h3>Ventes par Boutique</h3>
          <table width="100%" style="border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 1px solid #ddd;">
                <th style="padding: 10px;">Boutique</th>
                <th>Articles</th>
                <th>CA (Ar)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of shopStats" style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">{{ s.name }}</td>
                <td>{{ s.qty }}</td>
                <td>{{ s.amount | number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex: 1; }
    h3 { margin-top: 0; color: #333; }
    small { color: #666; text-transform: uppercase; font-size: 11px; font-weight: bold; }
  `]
})
export class AdminDashboardPage implements OnInit {
  loading = true;
  totalOrders = 0;
  totalRevenue = 0;
  totalItemsSold = 0;
  topProducts: any[] = [];
  shopStats: any[] = [];

  constructor(private service: BaseService<any>, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getAll('orders').subscribe({
      next: (data: any[]) => {
        // 1. Filtrer uniquement les livrées
        const delivered = data.filter(o => o.status === 'LIVREE');
        this.totalOrders = delivered.length;

        // 2. Initialiser les compteurs
        this.totalRevenue = 0;
        this.totalItemsSold = 0;
        const prodMap = new Map();
        const shopMap = new Map();

        // 3. Traiter les données
        delivered.forEach(order => {
          this.totalRevenue += (order.totalAmount || 0);

          (order.items || []).forEach((item: any) => {
            const qty = item.quantity || 0;
            this.totalItemsSold += qty;

            // Stats Produits
            const pId = item.product?._id || 'inconnu';
            const pName = item.product?.name || 'Produit inconnu';
            if (!prodMap.has(pId)) prodMap.set(pId, { name: pName, qty: 0 });
            prodMap.get(pId).qty += qty;

            // Stats Boutiques
            const sId = item.shop?._id || 'inconnu';
            const sName = item.shop?.name || 'Boutique inconnue';
            if (!shopMap.has(sId)) shopMap.set(sId, { name: sName, qty: 0, amount: 0 });
            shopMap.get(sId).qty += qty;
            shopMap.get(sId).amount += (item.unitPrice * qty);
          });
        });

        // 4. Convertir et Trier pour l'affichage
        this.topProducts = [...prodMap.values()]
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5);

        this.shopStats = [...shopMap.values()]
          .sort((a, b) => b.amount - a.amount);

        this.loading = false;
        this.cdr.detectChanges(); // Force le rafraîchissement
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}