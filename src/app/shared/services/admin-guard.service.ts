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


      //if logged in and user is not leader and consultant
      if (userRole !== "Admin") 
      {
        this.router.navigate(['main']);
        return false;
      }

  } else {
    this.router.navigate(['main']);
    return false;
  }

  return true;

}
}