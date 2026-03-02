// components/generic-list/generic-list.component.ts
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-generic-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.css']
})
export class GenericListComponent implements OnInit {

  @Input() endpoint!: string;
  @Input() fields!: any[];
  @Input() searchFields!: any[];

  items: any[] = [];
  form: any = {};
  editingItem: any = null;
  relationsData: any = {};
  searchModel: any = {};

  isProcessing = false;

  @Input() showTable: boolean = true;
  @Input() showForm: boolean = true;
  @Input() showSearch: boolean = true;

  @Input() canAdd: boolean = true;
  @Input() canEdit: boolean = true;
  @Input() canDelete: boolean = true;

  @Input() redirectAfterSuccess?: string;
  @Input() editingId?: string;

  /** Texte d'aide affiché sous le formulaire en mode édition */
  @Input() editHint?: string;

  /** Label du bouton d'action secondaire en mode édition (ex: "Passer commande") */
  @Input() editActionLabel?: string;

  /** Paramètres supplémentaires injectés dans le load() (ex: { user: userId }) */
  @Input() extraParams: any = {};

  /** Émis quand le bouton editActionLabel est cliqué */
  @Output() editActionClicked = new EventEmitter<any>();

  /**
   * Données de pré-remplissage pour le formulaire (ex: items d'un panier → commande).
   * Fusionné dans this.form lors du ngOnInit.
   */
  @Input() prefillData: any = null;

  /**
   * Filtres fixes appliqués à chaque chargement (ex: { user: userId }).
   * Uniquement pour la liste, n'affecte pas le formulaire.
   */
  @Input() filterParams?: any;

  /**
   * Émis après create ou update réussi.
   * Permet à la page parente de déclencher une action (ex: supprimer panier).
   */
  @Output() afterSubmit = new EventEmitter<void>();

  private loadedRelationEndpoints = new Set<string>();

  constructor(
    private service: BaseService<any>,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.showForm) {
      this.initializeModelStructure(this.form, this.fields);
      this.applyDefaultValues(this.form, this.fields);
      // Pré-remplit le formulaire avec des données externes (ex: depuis cart → order)
      if (this.prefillData) {
        Object.assign(this.form, this.prefillData);
      }
    }

    if (this.searchFields?.length && this.showSearch) {
      this.initializeModelStructure(this.searchModel, this.searchFields, true);
    }

    if (this.editingId) {
      this.service.getById(this.endpoint, this.editingId)
        .subscribe(data => {
          this.editingItem = data;
          this.initializeModelStructure(this.editingItem, this.fields);
          this.cdr.markForCheck();
        });
      return;
    }

    if (this.showTable) {
      this.load();
    }

    if (this.showForm || this.showSearch) {
      this.loadRelationsRecursive(this.fields);
    }
  }

  // =============================
  // LABEL HELPER
  // =============================

  /** Retourne field.label si défini, sinon capitalize du field.name */
  getFieldLabel(field: any): string {
    if (field.label) return field.label;
    const name = field.name || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Applique les defaultValue définis dans la config des fields.
   * Ne remplace pas une valeur déjà présente.
   */
  applyDefaultValues(model: any, fields: any[]) {
    fields.forEach(field => {
      if (field.defaultValue !== undefined && field.defaultValue !== null) {
        if (!model[field.name]) {
          model[field.name] = field.defaultValue;
        }
      }
      // Récursion pour subdocuments/nested
      if (field.fields && model[field.name]) {
        if (Array.isArray(model[field.name])) {
          model[field.name].forEach((item: any) => this.applyDefaultValues(item, field.fields));
        } else {
          this.applyDefaultValues(model[field.name], field.fields);
        }
      }
    });
  }

  /**
   * Retourne le label d'une relation pour l'affichage d'un champ verrouillé.
   * @param relationList liste des items de la relation (relationsData[field.name])
   * @param value        valeur actuelle du modèle (peut être un _id string ou un objet peuplé)
   */
  getRelationLabel(relationList: any[], value: any): string {
    if (!relationList || !value) return '—';
    const id = typeof value === 'object' ? value._id : value;
    const found = relationList.find((r: any) => r._id === id);
    return found?.name || found?.title || found?.label || id || '—';
  }

  // =============================
  // PERFORMANCE
  // =============================

  trackByIndex(index: number): number {
    return index;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  // =============================
  // DATA LOAD
  // =============================

  load() {
    const params = this.extraParams && Object.keys(this.extraParams).length > 0
      ? this.extraParams
      : (this.filterParams && Object.keys(this.filterParams).length > 0 ? this.filterParams : null);
    const obs = params
      ? this.service.getAllWithParams(this.endpoint, params)
      : this.service.getAll(this.endpoint);
    obs.subscribe(data => {
      this.items = [...data];
      this.cdr.markForCheck();
    });
  }

  loadRelationsRecursive(fields: any[]) {
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
      if (field.fields) {
        this.loadRelationsRecursive(field.fields);
      }
    });
  }

  // =============================
  // MODEL STRUCTURE
  // =============================

  get currentModel() {
    return this.editingItem ? this.editingItem : this.form;
  }

  initializeModelStructure(model: any, fields: any[], isSearch = false) {
    fields.forEach(field => {
      if (field.type === 'nested') {
        if (!model[field.name]) model[field.name] = {};
        this.initializeModelStructure(model[field.name], field.fields, isSearch);
      }
      if (field.type === 'array') {
        if (!model[field.name]) model[field.name] = [];
      }
      if (field.type === 'subdocument') {
        if (isSearch) {
          if (!model[field.name]) model[field.name] = {};
          this.initializeModelStructure(model[field.name], field.fields, true);
        } else {
          if (!model[field.name]) model[field.name] = [];
          model[field.name].forEach((item: any) => {
            this.initializeModelStructure(item, field.fields);
          });
        }
      }
    });
  }

  // =============================
  // SUBDOCUMENT
  // =============================

  addSubdocumentItem(field: any) {
    if (!this.currentModel[field.name]) this.currentModel[field.name] = [];
    const newItem: any = {};
    this.initializeModelStructure(newItem, field.fields);
    this.currentModel[field.name].push(newItem);
  }

  removeSubdocumentItem(fieldName: string, index: number) {
    this.currentModel[fieldName].splice(index, 1);
  }

  // =============================
  // SEARCH
  // =============================

  search() {
    const flatParams = this.flattenSearchModel(this.searchModel);
    this.service.getAllWithParams(this.endpoint, flatParams)
      .subscribe(data => {
        this.items = [...data];
        this.cdr.detectChanges();
      });
  }

  resetSearch() {
    this.searchModel = {};
    this.initializeModelStructure(this.searchModel, this.searchFields);
    this.service.getAll(this.endpoint)
      .subscribe(data => {
        this.items = [...data];
        this.cdr.detectChanges();
      });
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
  // CRUD
  // =============================

isImagePath(value: any): boolean {
  if (typeof value !== "string") return false;
  return value.startsWith("http") || value.includes("uploads");
}

getImageUrl(value: string): string {
  if (!value) return "";
  // ✅ Cloudinary / external URL already complete
  if (value.startsWith("http")) return value;

  // ✅ Old local path (uploads/xxx.jpg)
  return `${this.service["api"].replace("/api/", "/")}${value}`;
}
  refreshList() {
    this.service.getAll(this.endpoint)
      .subscribe(data => {
        this.items = [...data];
        this.cdr.detectChanges();
      });
  }

  submit() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    const payload = this.buildPayload(this.form);
    this.service.create(this.endpoint, payload)
      .subscribe({
        next: () => {
          this.isProcessing = false;
          if (this.redirectAfterSuccess) {
            this.router.navigate([this.redirectAfterSuccess]);
            return;
          }
          this.form = {};
          this.initializeModelStructure(this.form, this.fields);
          this.applyDefaultValues(this.form, this.fields);
          this.afterSubmit.emit();
          if (this.showTable) this.refreshList();
        },
        error: (err) => {
          console.error('CREATE ERROR', err);
          this.isProcessing = false;
        }
      });
  }

  edit(item: any) {
    this.editingItem = JSON.parse(JSON.stringify(item));
    this.initializeModelStructure(this.editingItem, this.fields);
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
          this.afterSubmit.emit();
          if (this.showTable) this.refreshList();
        },
        error: (err) => {
          console.error('UPDATE ERROR', err);
          this.isProcessing = false;
        }
      });
  }

  delete(id: string) {
    if (this.isProcessing) return;
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
      if (typeof value === 'object' && value !== null) {
        if (this.containsFile(value)) return true;
      }
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