import { Component, Input } from '@angular/core';
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
export class GenericListComponent {

  @Input() endpoint!: string;
  @Input() fields!: string[];

  items: any[] = [];
  form: any = {};

  constructor(private service: BaseService<any>) {}


  editingItem: any = null;

  edit(item: any) {
    this.editingItem = { ...item };
  }

  save(updateFn: Function) {
    updateFn(this.editingItem._id, this.editingItem);
    this.editingItem = null;
  }


  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll(this.endpoint)
      .subscribe(data => this.items = data);
  }

  submit() {
    this.service.create(this.endpoint, this.form)
      .subscribe(() => {
        this.form = {};
        this.load();
      });
  }

  delete(id: string) {
    this.service.delete(this.endpoint, id)
      .subscribe(() => this.load());
  }
}
