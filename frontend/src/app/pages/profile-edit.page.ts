// pages/profile-edit.page.ts
// Édition du profil de l'utilisateur connecté — préremplit via editingId = userId
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericListComponent } from '../components/generic-list/generic-list.component';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, GenericListComponent],
  template: `
    <p *ngIf="loading">Chargement...</p>

    <app-generic-list
      *ngIf="!loading && userId"
      endpoint="users"
      [fields]="fields"
      [searchFields]="[]"
      [showTable]="false"
      [showSearch]="false"
      [showForm]="true"
      [canEdit]="true"
      [canDelete]="false"
      [canAdd]="false"
      [editingId]="userId"
      redirectAfterSuccess="/product">
    </app-generic-list>
  `
})
export class ProfileEditPage implements OnInit {

  userId: string = '';
  loading = true;

  fields = [
    { name: 'name',   label: 'Nom',    type: 'text' },
    { name: 'email',  label: 'Email',  type: 'text' },
    { name: 'password',label:'Mot de passe', type: 'text' },
    { name: 'role',   label: 'Rôle',   type: 'select', options: ['VENDEUR', 'ACHETEUR'], locked: true },
    { name: 'avatar', label: 'Avatar', type: 'image' }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.init(user);
    } else {
      this.auth.getMe().subscribe({
        next: (u: any) => { this.auth.setUser(u); this.init(u); },
        error: () => { this.loading = false; this.router.navigate(['/login']); }
      });
    }
  }

  private init(user: any) {
    this.userId  = user._id;
    this.loading = false;
    this.cdr.detectChanges();
  }
}