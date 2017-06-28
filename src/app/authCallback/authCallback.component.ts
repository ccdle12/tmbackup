import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'authCallback-page',
    templateUrl: './authCallback.component.html',
    styleUrls: ['./authCallback.component.css']
}) 

export class AuthCallbackComponent  {
 constructor(public authService: AuthService, public router: Router) { 

     let userIsVerified = localStorage.getItem('verified');

      if (userIsVerified == "true" || userIsVerified == "1") {
        this.router.navigate(['main']);
      }
 }
}