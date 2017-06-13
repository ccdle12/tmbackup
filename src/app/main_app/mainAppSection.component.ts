import { Component }   from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router }      from '@angular/router';

@Component({
    templateUrl: './mainAppSection.component.html'
})

export class MainAppSectionComponent {
    constructor(public authService: AuthService, private router: Router) { }

    inTakeSurvey(): boolean {
        let currentUrl = this.router.url;
        
        let urlRegex = '(\/takesurvey\/.*)'
        if (currentUrl.match(urlRegex)) {
            return false;
        }

        return true;
    }
};