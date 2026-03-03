import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfilePage } from "./pages/profile.page";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ProfilePage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  constructor() {
    console.log('production?', environment.production);
    console.log('apiUrl:', environment.apiUrl);
  }
}
