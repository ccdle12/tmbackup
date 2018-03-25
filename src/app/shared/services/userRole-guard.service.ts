import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class UserRoleGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }


  canActivate() {
    let user: JSON = JSON.parse(localStorage.getItem('user'));
    
    if (user) 
    {
      let userRole: string = user['user_role'];
      ("User Role: " + userRole);
      
      //If in demo mode
      if (!this.auth.isAuthenticated && !this.auth.isVerified)
      {
        this.router.navigate(['main']);
        return false;
      }

      //if logged in and user is not leader and consultant
      if (userRole !== "Leader" && userRole !== "Consultant" && userRole !== "Admin" && userRole !== "Super User") 
      {
        this.router.navigate(['main']);
        return false;
      }

  } else {
    ("user has no user raw json");
    this.router.navigate(['main']);
    return false;
  }

  return true;

}
}