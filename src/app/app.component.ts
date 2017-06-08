import { Component, OnInit } from '@angular/core';
import { AuthService }       from './shared/services/auth.service';
import { LocalStorageService } from './shared/services/localStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   
   constructor(public authService: AuthService, public localStorageService: LocalStorageService) {
    authService.handleAuthentication();
   }
}
