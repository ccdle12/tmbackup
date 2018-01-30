import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { KumulosService } from '../shared/services/kumulos.service';
import { Router } from '@angular/router';
import { StylingService } from '../shared/services/styling.service';

@Component({
    selector: 'mainApp-page',
    styleUrls: ['./mainApp.component.css'],
    template:
    `   
    <div class="marginBottomMainApp"></div>
    `
}) 

export class MainAppComponent{
    constructor(public authService: AuthService, 
                public kumulosService: KumulosService,
                public router: Router,
                public stylingService: StylingService) 
    {
        this.inDemoOrInMainApp();
    }

    private inDemoOrInMainApp(): void {
        if (this.isUserUnverifiedOrTokenExpired())
            this.getDemoCity();
        else {
            this.getActiveVersionForCity(); 
        }
    }

    private isUserUnverifiedOrTokenExpired() {
        return !this.authService.isVerified() || !this.authService.isAuthenticated() ? true : false;
    }

    private getDemoCity(): void {
        this.kumulosService.getDemoCity()
            .subscribe(response => { 
                localStorage.setItem('demoCity', response.payload);
                this.getDemoUserJWT();
            });
    }

    private getDemoUserJWT(): void {
        this.kumulosService.getDemoUserJWT()
            .subscribe(response => { 
                localStorage.setItem('demoJWT', response.payload);
                this.getActiveVersionForCity(); 
        });
    }

    private getActiveVersionForCity(): void {
        this.kumulosService.getActiveVersionForCity()
        .subscribe(responseJSON => {
            let activeCityVersion: string = responseJSON.payload;
            localStorage.setItem('activeCityVersion', activeCityVersion);
            console.log("Getting active city version");
            console.log(responseJSON.payload);

            this.getWebDashboard(activeCityVersion);
        });
    }

    private getWebDashboard(activeCityVersion: string): void {
        console.log("Getting web dashboard");
        this.kumulosService.getWebDashboard(activeCityVersion)
        .subscribe(responseJSON => { 
            localStorage.setItem('surveydashboard', JSON.stringify(responseJSON.payload));
            console.log("Retreived dashboard: ");
            console.log(responseJSON.payload);
            this.router.navigateByUrl('/main/landingpage');
        });
    }
 }