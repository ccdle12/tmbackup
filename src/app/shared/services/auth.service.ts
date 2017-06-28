import { Injectable }      from '@angular/core';
import { Router }          from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {


constructor(public router: Router) { }

// *** Login Lock *** //
options = {
  additionalSignUpFields: [
    {
      name: "full_name",
      placeholder: "Enter your full name",
    },
    {
      name: "job_title",
      placeholder: "Enter your job title"
    }
  ]
}

lock = new Auth0Lock('dvSdZOn8HSYuGEkBQSdQQNG1FiW78i9V','tmfdmmdev.eu.auth0.com', this.options, {
  auth: {
    redirectUrl: 'https://tmf-dmm-web-app.firebaseapp.com/callback',
    // redirectUrl: 'http://localhost:4200/callback',
    redirect: true,
    responseType: 'token id_token',
    params: {
      scope: 'openid email app_metadata'
    },
  }
});

public handleAuthentication(): void {
  this.lock.on("authenticated", (authResult) => {
    this.lock.getUserInfo(authResult.accessToken, (error, userProfile) => {
    
      if (error) {
        console.log("Error: ", error);
        return;
      }

      if (userProfile)
      console.log("Login Lock activated");

      localStorage.clear();

      if (userProfile.app_metadata == null) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('verified', JSON.stringify(userProfile.email_verified));
        localStorage.setItem('user', JSON.stringify(userProfile.user_metadata));  
        localStorage.setItem('userName', JSON.stringify(userProfile.user_metadata.full_name));
      } else {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('verified', JSON.stringify(userProfile.app_metadata.verified));
        localStorage.setItem('user', JSON.stringify(userProfile.app_metadata));
        localStorage.setItem('userName', JSON.stringify(userProfile.given_name + " " + userProfile.family_name));
      }

      localStorage.setItem('userPicture', JSON.stringify(userProfile.picture));
      localStorage.setItem('userEmail', JSON.stringify(userProfile.email));

      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);

      let userIsVerified = localStorage.getItem('verified');
      console.log("is user verified: " + userIsVerified);
      console.log("user profile", userProfile);

      if (userProfile.user_metadata != null && userProfile.email_verified == true) {
         this.router.navigate(['main']);
      } else if (userProfile.app_metadata != null && userProfile.app_metadata.verified == 1) {
        this.router.navigate(['main']);
      } else {
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
