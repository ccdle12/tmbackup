import { Component }   from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router }      from '@angular/router';
import { KumulosService } from '../shared/services/kumulos.service';

@Component({
    templateUrl: './mainAppSection.component.html',
    styleUrls: ['./mainApp.component.css']
})

export class MainAppSectionComponent {

    constructor(public authService: AuthService, private router: Router, public kumulosService: KumulosService) {
        this.inDemoOrInMainApp();
     }

    private inDemoOrInMainApp(): void {
        if (this.isUserUnverifiedOrTokenExpired())
            this.getDemoCity();
        else {
            this.getActiveVersionForCity(); 
            console.log("RETRIEVING ACTIVE CITY VERSION...");    
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

            this.getWebDashboard(activeCityVersion);
        });
    }

    private getWebDashboard(activeCityVersion: string): void {
        this.kumulosService.getWebDashboard(activeCityVersion)
        .subscribe(responseJSON => { 
            localStorage.setItem('surveydashboard', JSON.stringify(responseJSON.payload));
        });
    }

    public hideNavBar(): boolean {
        let currentUrl: string = this.router.url;

        let urlRegexTakeSurvey: string = '(\/takesurvey\/.*)';
        let urlRegexViewResults: string = '(\/viewresults\/*)';

        if (currentUrl.match(urlRegexTakeSurvey) || currentUrl.match(urlRegexViewResults)) {
            return false;
        }

        return true;
    }

    public activeBackgroundColor() {
        return { 'background-color': '#62B3D1',
                  'color': 'white' };
    }
};