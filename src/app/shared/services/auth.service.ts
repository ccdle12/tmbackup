import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import auth0 from 'auth0-js';


@Injectable()
export class AuthService {
 
 constructor(public router: Router) {}

  auth0 = new auth0.WebAuth({
    clientID: 'dvSdZOn8HSYuGEkBQSdQQNG1FiW78i9V',
    domain: 'tmfdmmdev.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://tmfdmmdev.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/main',      
    scope: 'openid',
    leeway: 30
  });
  

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigateByUrl('/main');
      } else if (err) {
        this.router.navigateByUrl('/welcome');
        console.log(err);
      }
    });
  }


  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }


  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    this.router.navigate(['/']);
  }


  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}