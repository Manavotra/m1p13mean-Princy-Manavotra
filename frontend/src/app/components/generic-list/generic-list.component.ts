// components/generic-list/generic-list.components.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BaseService } from '../../services/base.service';

import { ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';

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

  isProcessing = false; // 🔥 NOUVEAU 
  
  // =============================
  // VISIBILITY TOGGLES
  // =============================

  @Input() showTable: boolean = true;
  @Input() showForm: boolean = true;
  @Input() showSearch: boolean = true;

  @Input() canAdd: boolean = true;
  @Input() canEdit: boolean = true;
  @Input() canDelete: boolean = true;

  // =============================
  // REDIRECTION
  // =============================

  @Input() redirectAfterSuccess?: string;


  @Input() editingId?: string; 
  

  /** 🔥 Cache pour éviter double download */
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
    this.service.getAll(this.endpoint)
      .subscribe(data => {
        // 🔥 Nouvelle référence = change detection garanti
        this.items = [...data];
        this.cdr.markForCheck(); // Informe Angular qu'il faut vérifier ce composant
      });
  }

  // 🔥 RÉCURSIF + CACHE
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

      // 🔁 récursion nested + subdocument
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

      if (!model[field.name]) {
        model[field.name] = {};
      }

      this.initializeModelStructure(
        model[field.name],
        field.fields,
        isSearch
      );
    }

    if (field.type === 'array') {

      if (!model[field.name]) {
        model[field.name] = [];
      }
    }

    if (field.type === 'subdocument') {

      if (isSearch) {
        // 🔥 MODE SEARCH → objet simple
        if (!model[field.name]) {
          model[field.name] = {};
        }

        this.initializeModelStructure(
          model[field.name],
          field.fields,
          true
        );

      } else {
        // 🔥 MODE CRUD NORMAL → array
        if (!model[field.name]) {
          model[field.name] = [];
        }

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

    if (!this.currentModel[field.name]) {
      this.currentModel[field.name] = [];
    }

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

  console.log("🔥 FLATTENED SEARCH:", flatParams);

  this.service.getAllWithParams(this.endpoint, flatParams)
    .subscribe(data => {
      this.items = [...data];      // 🔹 Nouvelle référence pour Angular
      this.cdr.detectChanges();    // 🔹 Force le rafraîchissement immédiat
    });
}


resetSearch() {
  this.searchModel = {};
  this.initializeModelStructure(this.searchModel, this.searchFields);

  this.service.getAll(this.endpoint)
    .subscribe(data => {
      this.items = [...data];      // 🔹 Nouvelle référence
      this.cdr.detectChanges();    // 🔹 Angular voit le changement
    });
}


  // resetSearch() {
  //   this.searchModel = {};
  //   this.initializeModelStructure(this.searchModel, this.searchFields);
  //   this.load();
  // }


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
    return typeof value === 'string' && value.includes('uploads');
  }


  getImageUrl(path: string): string {
    return `${this.service['api'].replace('/api/', '/')}${path}`;
  }

  refreshList() {
    this.service.getAll(this.endpoint)
      .subscribe(data => {
        this.items = [...data];   // 🔹 Nouvelle référence pour Angular
        this.cdr.detectChanges(); // 🔹 Force le rafraîchissement
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

        // 🔥 Redirection si définie
        if (this.redirectAfterSuccess) {
          this.router.navigate([this.redirectAfterSuccess]);
          return;
        }

        // Sinon comportement normal
        this.form = {};
        this.initializeModelStructure(this.form, this.fields);

        if (this.showTable) {
          this.refreshList();
        }
      },
      error: (err) => {
        console.error("CREATE ERROR", err);
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

        if (this.showTable) {
          this.refreshList();
        }
      },
      error: (err) => {
        console.error("UPDATE ERROR", err);
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
        this.refreshList();           // 🔹 Rafraîchit tout
        this.isProcessing = false;
      },
      error: (err) => {
        console.error("DELETE ERROR", err);
        this.isProcessing = false;
      }
    });
}


    // =============================
  // FILE HANDLING
  // =============================

  onFileChange(event: any, model: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      model[fieldName] = file;
    }
  }

  private buildPayload(model: any): any {

    if (!this.containsFile(model)) {
      return model; // JSON normal
    }

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
      }
      else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          this.appendFormData(formData, v, `${formKey}[${i}]`);
        });
      }
      else if (typeof value === 'object' && value !== null) {
        this.appendFormData(formData, value, formKey);
      }
      else if (value !== null && value !== undefined) {
        formData.append(formKey, value);
      }
    });
  }
}
