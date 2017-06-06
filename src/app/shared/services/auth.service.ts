import { Injectable }      from '@angular/core';
import { Router }          from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

 userProfile: any;

 constructor(public router: Router) { }
 
 lock = new Auth0Lock('dvSdZOn8HSYuGEkBQSdQQNG1FiW78i9V','tmfdmmdev.eu.auth0.com', {
   auth: {
      redirectUrl: 'http://localhost:4200/main',
      responseType: 'token id_token',
      params: {
        scope: 'openid' // Learn about scopes: https://auth0.com/docs/scopes
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

    this.userProfile = userProfile;

    localStorage.setItem('user_meta_data', JSON.stringify(userProfile.app_metadata));
    });
  });
}

public login(): void {
      this.lock.show();
  }


public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_meta_data');

    //Optional - if we have the logout button not on the welcome screen
    // this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    console.log(tokenNotExpired('id_token'));
    return tokenNotExpired('id_token');
  }
}
