import { Component }   from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router }      from '@angular/router';

@Component({
    templateUrl: './mainAppSection.component.html'
})

export class MainAppSectionComponent {
    constructor(public authService: AuthService, private router: Router) { }
};