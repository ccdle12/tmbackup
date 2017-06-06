import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'welcome-page',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
}) 

export class WelcomeComponent  {
 constructor(public authService: AuthService) { }
}