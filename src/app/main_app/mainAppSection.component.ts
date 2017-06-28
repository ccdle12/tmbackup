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
        if (!authService.isVerified() || !authService.isAuthenticated()) {
            this.kumulosService.getDemoCity()
                .subscribe(response => localStorage.setItem('demoCity', response.payload));

            this.kumulosService.getDemoUserJWT()
                .subscribe(response => localStorage.setItem('demoJWT', response.payload));
        }
     }

    public hideNavBar(): boolean {
        let currentUrl: string = this.router.url;
        console.log("Current Url: " + currentUrl);
        
        let urlRegexTakeSurvey: string = '(\/takesurvey\/.*)';
        let urlRegexViewResults: string = '(\/viewresults\/*)';

        if (currentUrl.match(urlRegexTakeSurvey) || currentUrl.match(urlRegexViewResults)) {
            return false;
        }

        return true;
    }


    public navigateToTakeSurvey(): void {
        this.router.navigate(['takesurvey']);
    }

    public activeBackgroundColor() {
        return { 'background-color': '#1e90ff',
                  'color': 'white' };
    }
};