import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

options: any;
lock: any;

constructor(public router: Router) { 

this.lock = new Auth0Lock('dvSdZOn8HSYuGEkBQSdQQNG1FiW78i9V','tmfdmmdev.eu.auth0.com', {
  auth: {
    redirectUrl: window.location.origin + '/callback',
    redirect: true,
    responseType: 'token id_token',
    params: {
      scope: 'openid email app_metadata'
    },
  }
});
}

public handleAuthentication(): void {
  this.lock.on("authenticated", (authResult) => {
    // console.log("Auth Result: ", authResult);
    // console.log("WINDOWS ORIGIN: ", window.location.origin);

    this.lock.getUserInfo(authResult.accessToken, (error, userProfile) => {
      // console.log("AUTHENTICATING USER FROMA AUTH0");

      if (error) {
        console.log("Error: ", error);
        return;
      }

      localStorage.clear();

      this.persistDataToLocalStorage(userProfile, authResult);

      // console.log("User profile: ", userProfile);

      this.handleRouting(userProfile);
    });
  });
} 

private persistDataToLocalStorage(userProfile: any, authResult: any): void {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));

      localStorage.setItem('user', JSON.stringify(userProfile.app_metadata));  
      localStorage.setItem('verified', JSON.stringify(userProfile.app_metadata.verified));
      localStorage.setItem('userPicture', JSON.stringify(userProfile.picture));
      localStorage.setItem('userEmail', JSON.stringify(userProfile.email));
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);

      if (this.userHasNameInMetaData(userProfile)) {
        localStorage.setItem('userName', JSON.stringify(userProfile.user_metadata.name));
      } else if (this.userDoesNotHaveMetaData(userProfile)) {
        localStorage.setItem('userName', JSON.stringify(userProfile.email)); 
      } else {
        localStorage.setItem('userName', JSON.stringify(userProfile.name));
      }
}

private userHasNameInMetaData(userProfile: any): boolean {
  return userProfile.user_metadata.name ? true : false;
}

private userDoesNotHaveMetaData(userProfile: any): boolean {
  return userProfile.user_metadata ? false: true;
}

private handleRouting(userProfile: any): void {
  if (userProfile.user_metadata != null && userProfile.email_verified == true) {
         this.router.navigate(['main']);
      } else if (userProfile.app_metadata != null && userProfile.app_metadata.verified == 1) {
        this.router.navigate(['main']);
      } else {
        this.router.navigate(['registration']);
    }
}

public login(): void {
  this.lock.show();
}

public logout(): void {
  window.location.reload();
  localStorage.clear();
  this.router.navigate(['/welcome']);
}

public isAuthenticated(): boolean {
  var isTokenNotExpired: boolean = tokenNotExpired('id_token');

  return isTokenNotExpired;
}

public revertToDemoIfTokenExpires(): void {
  // console.log('revert to demo called');
  let user = localStorage.getItem('user');

  // console.log('USER: ', user);
   if (user && !this.isAuthenticated()) {
    // console.log("AUTH EXPIRED, REVERTING TO MAIN");
    localStorage.clear();
    this.router.navigate(['welcome']);
   }
}


public isLeaderConsultant(): boolean {
  if (localStorage.getItem('user') !== null) {
    var userLeaderConsultant = JSON.parse(localStorage.getItem('user'));
    return userLeaderConsultant.user_role == 'Leader' || userLeaderConsultant.user_role == 'Consultant' ;
  }
  return false;
}

public isVerified(): boolean {
  if (localStorage.getItem('verified') !== null) {
    let verified = JSON.parse(localStorage.getItem('verified'));
    
    if (verified == "1" || verified == "true") {
      return true;
    }
    
    return false;
  }
}

public inDemoMode(): boolean {
  if (!this.isVerified()) {
    // console.log('user not verified');
    return true;
  }

  if (this.isVerified() && this.isLeaderConsultant()) {
    // console.log('user is verified and a leader');
    return false;
  }
    
  if (this.isVerified() && !this.isLeaderConsultant()) {    
    // console.log('user is verified and is not a leader');
    return true;
  } 
}

}
