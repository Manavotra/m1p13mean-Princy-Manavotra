// components/product-grid/product-grid.component.ts
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { ProfilePage } from '../../pages/profile.page';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfilePage],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {

  @Input() endpoint: string = 'products';
  @Input() fields!: any[];
  @Input() searchFields!: any[];

  @Input() showSearch: boolean = true;
  @Input() redirectAfterSuccess?: string;

  items: any[] = [];
  form: any = {};
  editingItem: any = null;
  relationsData: any = {};
  searchModel: any = {};

  isProcessing = false;
  showFormPanel = false;

  /** ID du shop du vendeur connecté (null si pas vendeur ou shop non approuvé) */
  vendorShopId: string | null = null;

  private loadedRelationEndpoints = new Set<string>();
  private imageFieldName: string | null = null;

  constructor(
    private service: BaseService<any>,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService
  ) {}

  // =============================
  // RÔLES UTILISATEUR
  // =============================

  get currentUser(): any {
    return this.auth.getUser();
  }

  get isVendeur(): boolean {
    return this.currentUser?.role === 'VENDEUR';
  }

  get isClient(): boolean {
    const role = this.currentUser?.role;
    return !!role && role !== 'VENDEUR' && role !== 'ADMIN';
  }

  // =============================
  // INIT — restaure la session si nécessaire avant de charger
  // =============================

  ngOnInit() {
    const imageField = this.fields?.find(f => f.type === 'image');
    this.imageFieldName = imageField?.name || null;

    this.initForm();
    this.loadRelations(this.fields);
    if (this.searchFields?.length) this.loadRelations(this.searchFields);

    const cached = this.auth.getUser();

    if (cached) {
      // Session déjà en mémoire (navigation normale)
      this.onSessionReady();
    } else {
      // Refresh de page : restaure la session via cookie avant de charger
      this.auth.getMe().subscribe({
        next: (user: any) => {
          this.auth.setUser(user);
          this.onSessionReady();
        },
        error: () => {
          // Non connecté : charge tous les produits normalement
          this.load();
        }
      });
    }
  }

  /** Appelé une fois la session connue */
  private onSessionReady() {
    if (this.isVendeur) {
      this.loadVendorProducts();
    } else {
      this.load();
    }
  }

  /**
   * Récupère le shop du vendeur (owner=userId, status=APPROUVE)
   * puis charge uniquement les produits DISPONIBLES de ce shop.
   */
  loadVendorProducts() {
    const userId = this.currentUser?._id;
    if (!userId) return;

    this.service.getAllWithParams('shops', { owner: userId, status: 'APPROUVE' })
      .subscribe({
        next: (shops: any[]) => {
          if (shops && shops.length > 0) {
            this.vendorShopId = shops[0]._id;
            // Pré-remplit le shop dans le formulaire
            this.form['shop'] = this.vendorShopId;
            // Charge les produits du shop avec status DISPONIBLE
            this.service.getAllWithParams(this.endpoint, {
              shop: this.vendorShopId,
              status: 'DISPONIBLE'
            }).subscribe(data => {
              this.items = [...data];
              this.cdr.detectChanges();
            });
          } else {
            this.vendorShopId = null;
            this.items = [];
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.items = [];
          this.cdr.detectChanges();
        }
      });
  }

  // =============================
  // LABEL
  // =============================

  getLabel(field: any): string {
    if (field.label) return field.label;
    const n = field.name || '';
    return n.charAt(0).toUpperCase() + n.slice(1);
  }

  // =============================
  // FORM INIT
  // =============================

  initForm() {
    this.form = {};
    this.fields?.forEach(f => {
      if (f.type === 'array') this.form[f.name] = [];
    });
    // Pré-remplit le shop si vendeur et shopId déjà connu
    if (this.isVendeur && this.vendorShopId) {
      this.form['shop'] = this.vendorShopId;
    }
  }

  get currentModel() {
    return this.editingItem || this.form;
  }

  toggleForm() {
    this.showFormPanel = !this.showFormPanel;
    if (this.showFormPanel && this.editingItem) {
      this.editingItem = null;
      this.initForm();
    }
  }

  cancelForm() {
    this.showFormPanel = false;
    this.editingItem = null;
    this.initForm();
  }

  /**
   * Retourne le nom du shop du vendeur pour le champ verrouillé.
   */
  getVendorShopName(): string {
    if (!this.vendorShopId || !this.relationsData['shop']) return '—';
    const shop = this.relationsData['shop'].find((s: any) => s._id === this.vendorShopId);
    return shop?.name || shop?.title || '—';
  }

  // =============================
  // DATA LOAD
  // =============================

  load() {
    this.service.getAll(this.endpoint)
      .subscribe(data => {
        this.items = [...data];
        this.cdr.detectChanges();
      });
  }

  loadRelations(fields: any[]) {
    fields.forEach(field => {
      if (field.type === 'relation' && field.endpoint) {
        if (!this.loadedRelationEndpoints.has(field.endpoint)) {
          this.loadedRelationEndpoints.add(field.endpoint);
          this.service.getAll(field.endpoint)
            .subscribe(data => {
              this.relationsData[field.name] = data;
            });
        }
      }
    });
  }

  refreshList() {
    if (this.isVendeur) {
      this.loadVendorProducts();
    } else {
      this.load();
    }
  }

  // =============================
  // SEARCH
  // =============================

  search() {
    const flatParams = this.flattenSearchModel(this.searchModel);
    // Vendeur : force le filtre shop + status DISPONIBLE
    if (this.isVendeur && this.vendorShopId) {
      flatParams['shop'] = this.vendorShopId;
      flatParams['status'] = 'DISPONIBLE';
    }
    this.service.getAllWithParams(this.endpoint, flatParams)
      .subscribe(data => {
        this.items = [...data];
        this.cdr.detectChanges();
      });
  }

  resetSearch() {
    this.searchModel = {};
    this.refreshList();
  }

  private flattenSearchModel(obj: any, parentKey = '', result: any = {}) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value === null || value === undefined || value === '') return;
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === 'object' && !Array.isArray(value)) {
        this.flattenSearchModel(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    });
    return result;
  }

  // =============================
  // CRUD (vendeur uniquement)
  // =============================

  submit() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    // Force shop + status pour vendeur
    if (this.isVendeur && this.vendorShopId) {
      this.form['shop'] = this.vendorShopId;
    }
    const payload = this.buildPayload(this.form);
    this.service.create(this.endpoint, payload)
      .subscribe({
        next: () => {
          this.isProcessing = false;
          if (this.redirectAfterSuccess) {
            this.router.navigate([this.redirectAfterSuccess]);
            return;
          }
          this.showFormPanel = false;
          this.initForm();
          this.refreshList();
        },
        error: (err) => {
          console.error('CREATE ERROR', err);
          this.isProcessing = false;
        }
      });
  }

  editProduct(item: any) {
    this.editingItem = JSON.parse(JSON.stringify(item));
    this.fields?.forEach(f => {
      if (f.type === 'relation' && this.editingItem[f.name]?._id) {
        this.editingItem[f.name] = this.editingItem[f.name]._id;
      }
    });
    this.showFormPanel = true;
  }

  save() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    const payload = this.buildPayload(this.editingItem);
    this.service.update(this.endpoint, this.editingItem._id, payload)
      .subscribe({
        next: () => {
          this.isProcessing = false;
          if (this.redirectAfterSuccess) {
            this.router.navigate([this.redirectAfterSuccess]);
            return;
          }
          this.editingItem = null;
          this.showFormPanel = false;
          this.refreshList();
        },
        error: (err) => {
          console.error('UPDATE ERROR', err);
          this.isProcessing = false;
        }
      });
  }

  delete(id: string) {
    if (this.isProcessing) return;
    if (!confirm('Supprimer ce produit ?')) return;
    this.isProcessing = true;
    this.service.delete(this.endpoint, id)
      .subscribe({
        next: () => {
          this.refreshList();
          this.isProcessing = false;
        },
        error: (err) => {
          console.error('DELETE ERROR', err);
          this.isProcessing = false;
        }
      });
  }

  // =============================
  // ACTIONS CLIENT
  // =============================

  /**
   * Crée directement un favori en DB puis redirige vers /favorite.
   */
  addToFavorites(item: any) {
    const userId = this.currentUser?._id;
    if (!userId) return;

    this.service.create('favorites', { user: userId, product: item._id }).subscribe({
      next: () => this.router.navigate(['/favorite']),
      error: (err) => console.error('FAVORITE ERROR', err)
    });
  }

  /**
   * Ajoute le produit au panier en DB (upsert) :
   * - Panier existant → ajoute/incrémente la ligne produit
   * - Pas de panier → en crée un nouveau
   * Puis redirige vers /cart.
   */
  addToCart(item: any) {
    const userId = this.currentUser?._id;
    if (!userId) return;

    this.service.getAllWithParams('carts', { user: userId }).subscribe({
      next: (carts: any[]) => {
        if (carts && carts.length > 0) {
          const cart = carts[0];
          const existingItems: any[] = cart.items || [];

          // Vérifie si le produit est déjà dans le panier
          const existingLine = existingItems.find(
            (i: any) => (i.product?._id || i.product) === item._id
          );

          let updatedItems;
          if (existingLine) {
            // Incrémente la quantité
            updatedItems = existingItems.map((i: any) => {
              const pid = i.product?._id || i.product;
              return pid === item._id
                ? { product: pid, quantity: (i.quantity || 1) + 1 }
                : { product: pid, quantity: i.quantity || 1 };
            });
          } else {
            // Nouvelle ligne
            updatedItems = [
              ...existingItems.map((i: any) => ({
                product: i.product?._id || i.product,
                quantity: i.quantity || 1
              })),
              { product: item._id, quantity: 1 }
            ];
          }

          this.service.update('carts', cart._id, { user: userId, items: updatedItems }).subscribe({
            next: () => this.router.navigate(['/cart']),
            error: (err) => console.error('CART UPDATE ERROR', err)
          });

        } else {
          // Création d'un nouveau panier
          this.service.create('carts', {
            user: userId,
            items: [{ product: item._id, quantity: 1 }]
          }).subscribe({
            next: () => this.router.navigate(['/cart']),
            error: (err) => console.error('CART CREATE ERROR', err)
          });
        }
      },
      error: (err) => console.error('CART FETCH ERROR', err)
    });
  }

  // =============================
  // IMAGE & DISPLAY HELPERS
  // =============================

  trackById(index: number, item: any): string {
    return item._id || index;
  }

  getImageField(item: any): string | null {
    if (!this.imageFieldName) return null;
    return item[this.imageFieldName] || null;
  }

  isImagePath(value: any): boolean {
    return typeof value === 'string' && value.includes('uploads');
  }

  getImageUrl(path: string): string {
    return `${this.service['api'].replace('/api/', '/')}${path}`;
  }

  getBadgeClass(status: string): string {
    if (!status) return 'default';
    return status.toLowerCase();
  }

  // =============================
  // FILE HANDLING
  // =============================

  onFileChange(event: any, model: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) model[fieldName] = file;
  }

  private buildPayload(model: any): any {
    if (!this.containsFile(model)) return model;
    const formData = new FormData();
    this.appendFormData(formData, model);
    return formData;
  }

  private containsFile(obj: any): boolean {
    for (const key in obj) {
      const value = obj[key];
      if (value instanceof File) return true;
      if (typeof value === 'object' && value !== null && this.containsFile(value)) return true;
    }
    return false;
  }

  private appendFormData(formData: FormData, data: any, parentKey = '') {
    Object.keys(data).forEach(key => {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      if (value instanceof File) {
        formData.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => this.appendFormData(formData, v, `${formKey}[${i}]`));
      } else if (typeof value === 'object' && value !== null) {
        this.appendFormData(formData, value, formKey);
      } else if (value !== null && value !== undefined) {
        formData.append(formKey, value);
      }
    });
  }
}