import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar";
import { NavbarComponent } from "../../shared/components/navbar/navbar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-customer-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.css',
})
export class CustomerLayout {
  year = new Date().getFullYear();

}
