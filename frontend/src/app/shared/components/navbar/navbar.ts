import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {

  @Input() role!: string;

  currentTheme = 'light';
  scrolled = false;

ngOnInit() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
}

toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "malltheme-light";
  const next = current === "malltheme-light" ? "malltheme-dark" : "malltheme-light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}
  

  onScroll() {
    this.scrolled = window.scrollY > 4;
  }

}