import { Component, Input }  from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { tokenNotExpired } from 'angular2-jwt';
import auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

lock: any;

options: any;


constructor(public router: Router, public snackbar: MatSnackBar, public dialog: MatDialog) { 

  this.options = {
    allowSignUp: false,
    languageDictionary: {
      title: 'TMF DMM',
    },
    theme: {
      logo: '../../../assets/DMMLogo.png',
    },
    auth: {
    redirectUrl: window.location.origin + '/callback',
    redirect: true,
    responseType: 'token id_token',
    params: {
      scope: 'openid email app_metadata'
    },  
  }
  }

  //Dev Env
  //'dvSdZ0n8HSYuGEkBQSdQQNG1FiW78i9V', 'tmfdmmdev.eu.auth0.com'

  //Live Env
  //'4PQhmzeQzyDp3F6vM39cPriygAHbx4bX','tmfdmm.eu.auth0.com'
this.lock = new Auth0Lock('dvSdZOn8HSYuGEkBQSdQQNG1FiW78i9V', 'tmfdmmdev.eu.auth0.com', this.options, {});
}

public handleAuthentication(): void {
  this.lock.on('authorization_error', (authResult) => {
    console.log("AUTH ERROR!");

    let dialogRef = this.dialog.open(LicenseInvalidDialog, {
      disableClose: true,
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(response => this.router.navigate(['welcome']));
  })

  this.lock.on("authenticated", (authResult) => {
    console.log("HANDLE AUTH CALLED");
    this.lock.getUserInfo(authResult.accessToken, (error, userProfile) => {

      if (error) {
        console.log("Error: ", error);
        return;
      }

      localStorage.clear();
      this.persistDataToLocalStorage(userProfile, authResult);

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

      // const expiresAt = JSON.stringify((authResult.expiresAt * 1000) + new Date().getTime());
      // localStorage.setItem('expires_at', expiresAt);

      if (this.userHasMetaData(userProfile)) {
        if (this.userHasNameInMetaData(userProfile)) 
          localStorage.setItem('userName', JSON.stringify(userProfile.user_metadata.name));
        else 
          localStorage.setItem('userName', JSON.stringify(userProfile.name));

      } else {
        localStorage.setItem('userName', JSON.stringify(userProfile.email)); 
      }
}

private userHasNameInMetaData(userProfile: any): boolean {
  return userProfile.user_metadata.name != null ? true : false;
}

private userHasMetaData(userProfile: any): boolean {
  return userProfile.user_metadata != null ? true: false;
}

private handleRouting(userProfile: any): void {
  if (userProfile.user_metadata != null && userProfile.email_verified == true) {
         this.router.navigate(['main/landingpage']);
      } else if (userProfile.app_metadata != null && userProfile.app_metadata.verified == 1) {
        this.router.navigate(['main/landingpage']);
      } else {
        this.router.navigate(['registration']);
    }
}

public login(): void {
  this.lock.show();
}

public logout(): void {
  localStorage.clear();
  this.router.navigate(['/welcome']);
}

public isAuthenticated(): boolean 
{  
  var isTokenNotExpired: boolean = tokenNotExpired('id_token');
   
  return isTokenNotExpired;
}

public hasUser(): boolean
{
  return localStorage.getItem('user') ? true : false;
}

public revertToDemoIfTokenExpires(): void {
  let user = localStorage.getItem('user');

   if (user && !this.isAuthenticated()) {
    localStorage.clear();
    this.router.navigate(['welcome']);
   }
}

public isAdmin(): boolean {
  if (localStorage.getItem('user') !== null) {
    var user = JSON.parse(localStorage.getItem('user'));
    return user.user_role == 'Admin';
  }
}

public isOrganizationAdmin(): boolean {
  if (localStorage.getItem('user') !== null) {
    var user = JSON.parse(localStorage.getItem('user'))

    return user.user_role == 'Organization Admin';
  }
}

public isLeaderConsultant(): boolean {
  if (localStorage.getItem('user') !== null) {
    var userLeaderConsultant = JSON.parse(localStorage.getItem('user'));
    return userLeaderConsultant.user_role == 'Leader' || userLeaderConsultant.user_role == 'Consultant' ||   userLeaderConsultant.user_role == 'Admin' || userLeaderConsultant.user_role == 'Organization Admin';
  }
  return false;
}

public isEvidencer(): boolean {
  if (localStorage.getItem('user') !== null) {
    var user = JSON.parse(localStorage.getItem('user'));
    return user.user_role == 'Evidencer';
  }
  return false;
}

public isTeam(): boolean {
  if (localStorage.getItem('user') !== null) {
    var user = JSON.parse(localStorage.getItem('user'));
    return user.user_role == 'Team';
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
    // console.log("not verified");
    return true;
  }

  if (this.isVerified() && this.isLeaderConsultant()) {
    
    // console.log("verified and leader or consultant");
    return false;
  }
    
  if (this.isVerified() && !this.isLeaderConsultant()) { 
    // console.log("verified but not leader or consultant");   
    return true;
  } 
}

public canSaveSurvey(): boolean {
  if (!this.isVerified()) {

    return true;
  }
}

public backToDashboard(): void 
{
  this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/main'));
}

public throwBackToWelcome(): void 
{
  this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/welcome'));
}

}

@Component({
  selector: '',
  templateUrl: '../dialogs/licenseInvalidDialog.html',
  styleUrls: ['../dialogs/licenseInvalidDialog.css']
})
export class LicenseInvalidDialog 
{
  constructor() {}
}