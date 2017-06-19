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
        if (!authService.isAuthenticated()) {
            this.kumulosService.getDemoCity()
                .subscribe(response => localStorage.setItem('demoCity', response.payload));

            this.kumulosService.getDemoUserJWT()
                .subscribe(response => localStorage.setItem('demoJWT', response.payload));
        }
     }

    public inTakeSurvey(): boolean {
        let currentUrl = this.router.url;
        
        let urlRegex = '(\/takesurvey\/.*)'
        if (currentUrl.match(urlRegex)) {
            return false;
        }

        return true;
    }

    public navigateToTakeSurvey(): void {
        this.router.navigate(['takesurvey']);
    }
};