import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="email" name="email" placeholder="Email">
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

    submit() {
    // 🔥 Ajout de withCredentials pour session cookie
    this.auth.login({
      email: this.email,
      password: this.password
    }, true).subscribe((res: any) => {

      this.auth.setUser(res.user);

        switch (res.user.role) {
        case 'ADMIN':
            this.router.navigate(['/order']);
            break;

        case 'VENDEUR':
            this.router.navigate(['/shop']);
            break;

        default:
            this.router.navigate(['/profile']);
        }
    });
    }
}