import { Component }   from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router }      from '@angular/router';

@Component({
    template: 
    `<div class="btn-group btn-group-justified navigationButtons">
        <a routerLink="teamadmin"   class="btn btn-primary">Team Admin</a>
        <a routerLink="takesurvey"  class="btn btn-primary">Take Survey</a>
        <a routerLink="viewresults" class="btn btn-primary">View Results</a>
        <a routerLink="/" class="btn btn-primary">Publish</a>
        <a routerLink="/" class="btn btn-primary">Benchmark</a>
        <a *ngIf="authService.isAuthenticated()" (click)="logOut()" class="btn btn-primary">Logout</a>
    </div>
        <router-outlet></router-outlet>
    `
})

export class MainAppSectionComponent {
    constructor(public authService: AuthService, private router: Router) { }

    public logOut(): void {
        this.authService.logout();
        
        this.router.navigate(['welcome']);
    }

};