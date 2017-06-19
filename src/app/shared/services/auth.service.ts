import { Injectable }      from '@angular/core';
import { Router }          from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

constructor(public router: Router) { }

lock = new Auth0Lock('dvSdZOn8HSYuGEkBQSdQQNG1FiW78i9V','tmfdmmdev.eu.auth0.com', {
  auth: {
    redirectUrl: 'http://localhost:4200/callback',
    responseType: 'token id_token',
    params: {
      scope: 'openid email app_metadata'
    }
  }
});

public handleAuthentication(): void {
  this.lock.on("authenticated", (authResult) => {
    this.lock.getUserInfo(authResult.accessToken, (error, userProfile) => {
    
      if (error) {
        console.log("Error: ", error);
        return;
      }

      localStorage.clear();
      
      console.log("User JSON", JSON.stringify(userProfile));
      localStorage.setItem('user', JSON.stringify(userProfile.app_metadata));
      localStorage.setItem('userPicture', JSON.stringify(userProfile.picture));
      localStorage.setItem('userName', JSON.stringify(userProfile.given_name + " " + userProfile.family_name));
      localStorage.setItem('userEmail', JSON.stringify(userProfile.email));
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      
      if (userProfile.app_metadata.verified == "1") {
        this.router.navigate(['main']);
      }
    
      if (userProfile.app_metadata.verified == "0") {
        this.router.navigate(['registration']);
      }

    });
  });
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
  var isTokenExpired: boolean = tokenNotExpired('id_token');

  return isTokenExpired;
}

public isLeaderConsultant(): boolean {
  if (localStorage.getItem('user') !== null) {
    var userLeaderConsultant = JSON.parse(localStorage.getItem('user'));
    return userLeaderConsultant.user_role == 'Leader' || userLeaderConsultant.user_role == 'Consultant' ;
  }
  return false;
}

public isVerified(): boolean {
  if (localStorage.getItem('user') !== null) {
    var userProfile = JSON.parse(localStorage.getItem('user'));
    return userProfile.verified != 0;
  }
  return false;
}

public isDemoOrMain(): boolean {
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
