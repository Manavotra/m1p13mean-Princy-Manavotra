// pages/admin-dashboard.page.ts
// Dashboard admin : stats ventes LIVRÉES — diagramme circulaire par boutique + top 5 produits
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dash-wrapper">
      <header class="dash-header">
        <h1>📊 Dashboard Admin</h1>
        <span class="dash-subtitle">Statistiques basées sur les commandes <strong>LIVRÉES</strong></span>
      </header>

      <p class="dash-loading" *ngIf="loading">⏳ Chargement des données...</p>

      <ng-container *ngIf="!loading">

        <!-- ── KPIs ─────────────────────────────────── -->
        <div class="kpi-row">
          <div class="kpi-card">
            <span class="kpi-icon">💰</span>
            <div class="kpi-value">{{ totalRevenue | number:'1.0-0' }} Ar</div>
            <div class="kpi-label">Chiffre d'affaires total</div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">📦</span>
            <div class="kpi-value">{{ totalOrders }}</div>
            <div class="kpi-label">Commandes livrées</div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">🏪</span>
            <div class="kpi-value">{{ shopStats.length }}</div>
            <div class="kpi-label">Boutiques actives</div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">🛒</span>
            <div class="kpi-value">{{ totalItemsSold }}</div>
            <div class="kpi-label">Articles vendus</div>
          </div>
        </div>

        <!-- ── GRAPHIQUES ────────────────────────────── -->
        <div class="charts-row">

          <!-- Diagramme circulaire : répartition par boutique -->
          <div class="chart-card">
            <h3>🏪 Répartition des ventes par boutique</h3>
            <div class="pie-container">
              <svg viewBox="0 0 200 200" class="pie-svg" #pieSvg>
                <g transform="translate(100,100)">
                  <path *ngFor="let s of pieSlices"
                        [attr.d]="s.d"
                        [attr.fill]="s.color"
                        class="pie-slice">
                    <title>{{ s.label }} — {{ s.amount | number:'1.0-0' }} Ar ({{ s.pct }}%)</title>
                  </path>
                </g>
              </svg>
              <div class="pie-legend">
                <div class="legend-item" *ngFor="let s of pieSlices">
                  <span class="legend-dot" [style.background]="s.color"></span>
                  <span class="legend-name">{{ s.label }}</span>
                  <span class="legend-val">{{ s.amount | number:'1.0-0' }} Ar</span>
                  <span class="legend-pct">{{ s.pct }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Diagramme en barres : top 5 produits -->
          <div class="chart-card">
            <h3>🏆 Top 5 produits les plus vendus</h3>
            <div class="bar-chart">
              <div class="bar-row" *ngFor="let p of top5Products; let i = index">
                <span class="bar-rank">#{{ i + 1 }}</span>
                <span class="bar-label" [title]="p.name">{{ p.name | slice:0:20 }}{{ p.name.length > 20 ? '…' : '' }}</span>
                <div class="bar-track">
                  <div class="bar-fill"
                       [style.width.%]="(p.qty / top5Products[0].qty) * 100"
                       [style.background]="barColors[i]">
                  </div>
                </div>
                <span class="bar-val">{{ p.qty }} vendus</span>
              </div>
              <p class="no-data" *ngIf="top5Products.length === 0">Aucune donnée</p>
            </div>
          </div>

        </div>

        <!-- ── TABLE BOUTIQUES ───────────────────────── -->
        <div class="table-card">
          <h3>📋 Détail par boutique</h3>
          <table class="stat-table">
            <thead>
              <tr><th>Boutique</th><th>Commandes</th><th>Articles vendus</th><th>CA (Ar)</th><th>% du total</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of shopStats">
                <td>{{ s.name }}</td>
                <td>{{ s.orders }}</td>
                <td>{{ s.qty }}</td>
                <td>{{ s.amount | number:'1.0-0' }}</td>
                <td>
                  <div class="pct-bar">
                    <div [style.width.%]="s.pct" [style.background]="'#6366f1'"></div>
                    <span>{{ s.pct }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="no-data" *ngIf="shopStats.length === 0">Aucune donnée</p>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@700&display=swap');

    :host { display: block; }

    .dash-wrapper {
      font-family: 'DM Sans', sans-serif;
      background: #0f172a;
      min-height: 100vh;
      color: #e2e8f0;
      padding: 32px 24px;
    }

    .dash-header { margin-bottom: 32px; }
    .dash-header h1 { font-family: 'Space Mono', monospace; font-size: 28px; color: #f8fafc; margin: 0 0 4px; }
    .dash-subtitle { color: #94a3b8; font-size: 14px; }
    .dash-loading { color: #94a3b8; }

    /* KPIs */
    .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
    .kpi-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .kpi-icon { font-size: 28px; display: block; margin-bottom: 8px; }
    .kpi-value { font-family: 'Space Mono', monospace; font-size: 22px; color: #818cf8; font-weight: 700; }
    .kpi-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }

    /* Charts row */
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    @media (max-width: 768px) { .charts-row { grid-template-columns: 1fr; } }

    .chart-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 24px;
    }
    .chart-card h3 { font-size: 15px; color: #f1f5f9; margin: 0 0 20px; }

    /* Pie chart */
    .pie-container { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
    .pie-svg { width: 180px; height: 180px; flex-shrink: 0; }
    .pie-slice { cursor: pointer; transition: opacity .2s; stroke: #1e293b; stroke-width: 1; }
    .pie-slice:hover { opacity: .85; }

    .pie-legend { flex: 1; min-width: 140px; }
    .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .legend-name { flex: 1; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px; }
    .legend-val { color: #818cf8; font-family: 'Space Mono', monospace; font-size: 11px; }
    .legend-pct { color: #64748b; font-size: 11px; }

    /* Bar chart */
    .bar-chart { display: flex; flex-direction: column; gap: 14px; }
    .bar-row { display: grid; grid-template-columns: 24px 1fr 1fr 70px; align-items: center; gap: 8px; }
    .bar-rank { font-family: 'Space Mono', monospace; font-size: 11px; color: #64748b; }
    .bar-label { font-size: 13px; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { height: 18px; background: #0f172a; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width .6s ease; }
    .bar-val { font-family: 'Space Mono', monospace; font-size: 11px; color: #94a3b8; text-align: right; }

    /* Table */
    .table-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 24px;
      overflow-x: auto;
    }
    .table-card h3 { font-size: 15px; color: #f1f5f9; margin: 0 0 16px; }
    .stat-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .stat-table th { color: #64748b; font-weight: 600; padding: 8px 12px; text-align: left; border-bottom: 1px solid #334155; }
    .stat-table td { padding: 10px 12px; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
    .stat-table tr:last-child td { border-bottom: none; }

    .pct-bar { display: flex; align-items: center; gap: 8px; }
    .pct-bar div { height: 8px; border-radius: 4px; min-width: 2px; }
    .pct-bar span { font-size: 12px; color: #94a3b8; }

    .no-data { color: #64748b; font-size: 14px; text-align: center; padding: 20px 0; }
  `]
})
export class AdminDashboardPage implements OnInit {

  loading = true;
  totalRevenue  = 0;
  totalOrders   = 0;
  totalItemsSold = 0;

  shopStats: { name: string; orders: number; qty: number; amount: number; pct: number }[] = [];
  top5Products: { name: string; qty: number }[] = [];
  pieSlices: { d: string; color: string; label: string; amount: number; pct: number }[] = [];

  readonly COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#8b5cf6','#06b6d4','#84cc16'];
  readonly barColors = ['#6366f1','#818cf8','#a5b4fc','#c7d2fe','#e0e7ff'];

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: BaseService<any>
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) { this.loadStats(); }
    else {
      this.auth.getMe().subscribe({
        next: (u: any) => { this.auth.setUser(u); this.loadStats(); },
        error: () => this.router.navigate(['/login'])
      });
    }
  }

  private loadStats() {
    // Charge toutes les commandes LIVRÉES
    this.service.getAllWithParams('orders', { status: 'LIVREE' }).subscribe({
      next: (orders: any[]) => {
        this.totalOrders  = orders.length;
        this.totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

        // ── Stats par boutique ──────────────────────────────────────────
        const shopMap = new Map<string, { name: string; orders: number; qty: number; amount: number }>();

        orders.forEach(order => {
          (order.items || []).forEach((item: any) => {
            const shopId   = item.shop?._id   || item.shop   || 'Inconnu';
            const shopName = item.shop?.name  || item.shop   || 'Boutique inconnue';
            const qty      = item.quantity    || 0;
            const amount   = (item.unitPrice  || 0) * qty;

            this.totalItemsSold += qty;

            if (!shopMap.has(shopId)) {
              shopMap.set(shopId, { name: shopName, orders: 0, qty: 0, amount: 0 });
            }
            const s = shopMap.get(shopId)!;
            s.qty    += qty;
            s.amount += amount;
          });

          // Compte les commandes par boutique via le premier item
          const firstShopId = order.items?.[0]?.shop?._id || order.items?.[0]?.shop || 'Inconnu';
          if (shopMap.has(firstShopId)) {
            shopMap.get(firstShopId)!.orders++;
          }
        });

        const totalShopAmount = [...shopMap.values()].reduce((s, v) => s + v.amount, 0) || 1;

        this.shopStats = [...shopMap.values()]
          .sort((a, b) => b.amount - a.amount)
          .map(s => ({ ...s, pct: Math.round((s.amount / totalShopAmount) * 100) }));

        // ── Diagramme circulaire ────────────────────────────────────────
        this.pieSlices = this.buildPieSlices(this.shopStats, totalShopAmount);

        // ── Top 5 produits ──────────────────────────────────────────────
        const prodMap = new Map<string, { name: string; qty: number }>();

        orders.forEach(order => {
          (order.items || []).forEach((item: any) => {
            const prodId   = item.product?._id  || item.product  || 'inconnu';
            const prodName = item.product?.name || 'Produit inconnu';
            const qty      = item.quantity || 0;

            if (!prodMap.has(prodId)) {
              prodMap.set(prodId, { name: prodName, qty: 0 });
            }
            prodMap.get(prodId)!.qty += qty;
          });
        });

        this.top5Products = [...prodMap.values()]
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5);

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  /** Calcule les arcs SVG pour le diagramme circulaire */
  private buildPieSlices(
    stats: { name: string; amount: number; pct: number }[],
    total: number
  ) {
    const R = 90;
    let startAngle = -Math.PI / 2;

    return stats.map((s, i) => {
      const slice    = (s.amount / total) * 2 * Math.PI;
      const endAngle = startAngle + slice;
      const x1 = R * Math.cos(startAngle);
      const y1 = R * Math.sin(startAngle);
      const x2 = R * Math.cos(endAngle);
      const y2 = R * Math.sin(endAngle);
      const large = slice > Math.PI ? 1 : 0;

      const d = `M 0 0 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
      startAngle = endAngle;

      return {
        d,
        color: this.COLORS[i % this.COLORS.length],
        label: s.name,
        amount: s.amount,
        pct: s.pct
      };
    });
  }
}