import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'registration-page',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
}) 

export class RegistrationComponent  {
 constructor(public authService: AuthService) { }
}