import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfilePage } from './pages/profile.page';
import { filter } from 'rxjs/operators';
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ProfilePage,
    Footer
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showNavbar = false;

  constructor(private router: Router) {
    console.log('production?', environment.production);
    console.log('apiUrl:', environment.apiUrl);


    this.showNavbar = this.shouldShowNavbar(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showNavbar = this.shouldShowNavbar(e.urlAfterRedirects);
      });
  }

  private shouldShowNavbar(url: string): boolean {
    const clean = (url || '').split('?')[0].split('#')[0];

    if (clean === '' || clean === '/') return false;
    if (clean.startsWith('/login')) return false;
    if (clean.startsWith('/users/create')) return false;

    return true;
  }
}