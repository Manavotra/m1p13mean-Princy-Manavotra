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

  constructor(private service: BaseService<any>) {}

  ngOnInit() {
    this.load();
    this.loadRelations();
  }

  load() {
    this.service.getAll(this.endpoint)
      .subscribe(data => this.items = data);
  }

  loadRelations() {
    this.fields.forEach(field => {
      if (field.type === 'relation') {
        this.service.getAll(field.endpoint)
          .subscribe(data => {
            console.log("Relations chargées pour", field.name, data);
            this.relationsData[field.name] = data;
          });
      }
    });
  }

  submit() {
    this.service.create(this.endpoint, this.form)
      .subscribe(() => {
        this.form = {};
        this.load();
      });
  }

  edit(item: any) {
    this.editingItem = { ...item };
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