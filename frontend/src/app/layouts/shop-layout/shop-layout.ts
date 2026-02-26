import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../shared/components/navbar/navbar";

@Component({
  selector: 'app-shop-layout',
  imports: [SidebarComponent, RouterOutlet, NavbarComponent],
  templateUrl: './shop-layout.html',
  styleUrl: './shop-layout.css',
})
export class ShopLayout {
year = new Date().getFullYear();
}
