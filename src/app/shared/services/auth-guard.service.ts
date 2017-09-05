import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MdDialog } from '@angular/material';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private dialog: MdDialog) { }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated() && this.auth.hasUser()) {
      localStorage.clear();
      window.location.reload();
      this.auth.throwBackToWelcome();

      return false;
    }
    
    if (this.auth.isAuthenticated() && !this.auth.isVerified()) {
      this.router.navigate(['welcome']);
      return false;
    }

    return true;
  }
}