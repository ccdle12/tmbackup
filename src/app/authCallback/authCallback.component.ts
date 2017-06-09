import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'authCallback-page',
    templateUrl: './authCallback.component.html',
    styleUrls: ['./authCallback.component.css']
}) 

export class AuthCallbackComponent  {
 constructor(public authService: AuthService) { }
}