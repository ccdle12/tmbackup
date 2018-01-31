import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }


  canActivate() {
    let user: JSON = JSON.parse(localStorage.getItem('user'));
    
    if (user) 
    {
      let userRole: string = user['user_role'];
      console.log("User Role: " + userRole);
      


      //if logged in and user is not leader and consultant
      if (userRole !== "Admin") 
      {
        this.router.navigate(['main']);
        return false;
      }

  } else {
    console.log("user has no user raw json");
    this.router.navigate(['main']);
    return false;
  }

  return true;

}
}