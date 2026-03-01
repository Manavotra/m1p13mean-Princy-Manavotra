import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <h2>Profile</h2>

        <div *ngIf="user$ | async as user; else noUser">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
        <button (click)="logout()">Logout</button>
        </div>

        <ng-template #noUser>
        <p>Loading or not logged in...</p>
        </ng-template>
    `
})
export class ProfilePage implements OnInit {
    // 1. On change le type pour un Observable (important pour le pipe async)
    user$: Observable<any> | undefined;

  constructor(private auth: AuthService) {}

    ngOnInit() {
        // 2. On affecte directement l'observable sans faire de .subscribe() manuel
        // La logique NgZone est déjà gérée à l'intérieur de getMe()
        this.user$ = this.auth.getMe();
    }

    logout() {
        this.auth.logout().subscribe(() => {
        // Pour le logout, on redirige simplement
        location.href = '/login';
        });
    }
}