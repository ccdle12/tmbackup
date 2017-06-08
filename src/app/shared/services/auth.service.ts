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
      redirectUrl: 'http://localhost:4200/main',
      responseType: 'token id_token',
      params: {
        scope: 'openid email'
      }
    }
});


public handleAuthentication(): void {

  this.lock.on("authenticated", (authResult) => {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);

    console.log(authResult);

  this.lock.getUserInfo(authResult.accessToken, (error, userProfile) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }

    localStorage.setItem('user', JSON.stringify(userProfile));
    });
  });
}


public login(): void {
      this.lock.show();
  }


public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');

    this.router.navigate(['/']);
  }


  public isAuthenticated(): boolean {
    console.log(tokenNotExpired('id_token'));
    return tokenNotExpired('id_token');
  }

  public isLeaderConsultant(): boolean {
    if (localStorage.getItem('user') !== null) {
      var userLeaderConsultant = JSON.parse(localStorage.getItem('user'));
      return userLeaderConsultant.app_metadata.user_role == 'Leader' || userLeaderConsultant.app_metadata.user_role == 'Consultant' ;
    }

    return false;
}


  public isVerified(): boolean {
    if (localStorage.getItem('user') !== null) {
      var userProfile = JSON.parse(localStorage.getItem('user'));
      return userProfile.app_metadata.verified != 0;
    }

    return false;
  }

  public isAuthenticatedAndIsLeaderAndNotDemo(): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }
    
    if (this.isAuthenticated() && !this.isLeaderConsultant()) {
      return false;
    }
    return true;
  }

}
