import { Component, OnInit } from '@angular/core';
import { AuthService }       from './shared/services/auth.service';
import { LocalStorageService } from './shared/services/localStorage.service';



import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';

import {NgZone, Renderer, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    public getUserAvatar(): any {

        var userAvatar;

        if (this.authService.isAuthenticated() && localStorage.getItem('userPicture')) {
            userAvatar = JSON.parse(localStorage.getItem('userPicture')); 
        } else {
            userAvatar = '../assets/default_avatar.png';
        }

        return userAvatar;
    }
   
  // Instead of holding a boolean value for whether the spinner
    // should show or not, we store a reference to the spinner element,
    // see template snippet below this script
    @ViewChild('spinnerElement') spinnerElement: ElementRef;

   constructor(private router: Router,  private ngZone: NgZone,
               private renderer: Renderer, public authService: AuthService, 
               public localStorageService: LocalStorageService) {

        this.authService.handleAuthentication();
        this.authService.revertToDemoIfTokenExpires();

        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });
    }


    // Shows and hides the loading spinner during RouterEvent changes
    private navigationInterceptor(event: RouterEvent): void {
       if (event instanceof NavigationStart) {

            // We want to run this function outside of Angular's zone to
            // bypass change detection
            this.ngZone.runOutsideAngular(() => {

                // For simplicity we are going to turn opacity on / off
                // you could add/remove a class for more advanced styling
                // and enter/leave animation of the spinner
                this.renderer.setElementStyle(
                    this.spinnerElement.nativeElement,
                    'opacity',
                    '5'
                );
            });
        }

        if (event instanceof NavigationEnd) {
            this.hideSpinner();
        }

        // Set loading state to false in both of the below events to
        // hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this.hideSpinner();
        }

        if (event instanceof NavigationError) {
            this.hideSpinner();
        }
    }

    private hideSpinner(): void {

        // We wanna run this function outside of Angular's zone to
        // bypass change detection, 
        this.ngZone.runOutsideAngular(() => {

            // For simplicity we are going to turn opacity on / off
            // you could add/remove a class for more advanced styling
            // and enter/leave animation of the spinner
            this.renderer.setElementStyle(
                this.spinnerElement.nativeElement,
                'opacity',
                '0'
            );
        });
    }
}
