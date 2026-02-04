import { Component } from '@angular/core';
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UsersComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}
