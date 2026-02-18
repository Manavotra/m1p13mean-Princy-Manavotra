// components/generic-list/generic-list.components.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  items: any[] = [];
  form: any = {};
  editingItem: any = null;
  relationsData: any = {};

  @Input() searchFields!: any[];
  searchModel: any = {};

  /** 🔥 Cache pour éviter double download */
  private loadedRelationEndpoints = new Set<string>();

  constructor(private service: BaseService<any>) {}

  ngOnInit() {
    // 🔹 Form CRUD
    this.initializeModelStructure(this.form, this.fields);

    // 🔹 Search model
    if (this.searchFields?.length) {
      this.initializeModelStructure(this.searchModel, this.searchFields);
    }

    this.load();
    this.loadRelationsRecursive(this.fields); // 🔥 remplacé
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
      .subscribe(data => this.items = data);
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

  initializeModelStructure(model: any, fields: any[]) {

    fields.forEach(field => {

      if (field.type === 'nested') {

        if (!model[field.name]) {
          model[field.name] = {};
        }

        this.initializeModelStructure(
          model[field.name],
          field.fields
        );
      }

      if (field.type === 'array') {

        if (!model[field.name]) {
          model[field.name] = [];
        }
      }

      if (field.type === 'subdocument') {

        if (!model[field.name]) {
          model[field.name] = [];
        }

        model[field.name].forEach((item: any) => {
          this.initializeModelStructure(item, field.fields);
        });
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

    const params: any = {};

    const flatten = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, newKey);
        } else if (value !== null && value !== '') {
          params[`search[${newKey}]`] = value;
        }
      });
    };

    flatten(this.searchModel);

    console.log("SEARCH PARAMS:", params); // 👈 AJOUTE ÇA

    this.service.getAllWithParams(this.endpoint, params)
      .subscribe(data => this.items = data);
  }


resetSearch() {
  this.searchModel = {};
  this.initializeModelStructure(this.searchModel, this.searchFields);
  this.load();
}




  // =============================
  // CRUD
  // =============================

  submit() {
    this.service.create(this.endpoint, this.form)
      .subscribe(() => {
        this.form = {};
        this.initializeModelStructure(this.form, this.fields);
        this.load();
      });
  }

  edit(item: any) {
    this.editingItem = JSON.parse(JSON.stringify(item));
    this.initializeModelStructure(this.editingItem, this.fields);
  }

  save() {
    this.service.update(this.endpoint, this.editingItem._id, this.editingItem)
      .subscribe(() => {
        this.editingItem = null;
        this.load();
      });
  }

  delete(id: string) {
    this.service.delete(this.endpoint, id)
      .subscribe(() => this.load());
  }
}
