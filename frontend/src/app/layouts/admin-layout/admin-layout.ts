import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar";

@Component({
  selector: 'app-admin-layout',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
