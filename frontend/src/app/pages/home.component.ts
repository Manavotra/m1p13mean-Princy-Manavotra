// pages/home.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <h2>Accueil</h2>
    <ul>
      <li><a routerLink="/users">Users</a></li>
      <li><a routerLink="/products">Products</a></li>
    </ul>
  `
})
export class HomeComponent {}
