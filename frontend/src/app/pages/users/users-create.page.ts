import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, GenericListComponent],
  template: `
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">

          <div class="flex items-center justify-between">
            <h2 class="card-title text-2xl">Inscription</h2>
          </div>

          <p class="text-sm opacity-70">
            Créez votre compte pour accéder à l’application.
          </p>

          <form class="mt-4 space-y-4">
            <app-generic-list
              endpoint="users"
              [fields]="fields"
              [searchFields]="searchFields"
              [showForm]="true"
              [showTable]="false"
              [showSearch]="false"
              [canEdit]="false"
              [canDelete]="false"
              [canAdd]="true"
              redirectAfterSuccess="/favorite"

              [embedded]="true"
              [showProfile]="false"
              formTitle=""
              submitLabel="Créer mon compte">
            </app-generic-list>

            <div class="divider">OU</div>

            <a routerLink="/" class="btn btn-outline w-full">
              J’ai déjà un compte (Se connecter)
            </a>
          </form>

        </div>
      </div>
    </div>
  `
})
export class UserCreatePage {
fields = [
  { name: 'name', type: 'text' },
  { name: 'email', type: 'text' },
  { name: 'password', type: 'password' },  
  { name: 'role', type: 'select', options: ['ADMIN', 'VENDEUR', 'ACHETEUR'] },
  { name: 'avatar', type: 'image' }
];

  searchFields = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'role', type: 'select', options: ['ADMIN', 'VENDEUR', 'ACHETEUR'] }
  ];
}