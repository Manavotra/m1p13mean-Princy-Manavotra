import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  form = {
    name: '',
    email: '',
    role: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(data => {
      this.users = data;
    });
  }

  submit() {
    this.userService.create(this.form).subscribe(() => {
      this.form = { name: '', email: '', role: '' };
      this.loadUsers();
    });
  }

  deleteUser(id: string) {
    this.userService.delete(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
