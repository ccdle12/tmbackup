import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {



public getUserName(): string {
    if (localStorage.getItem('user') !== null) {
        let userName = JSON.parse(localStorage.getItem('userName'));
        return userName;
    }
    return "Demo User";
  }

public getUserCity(): string {
    if (localStorage.getItem('user') !== null) {
        let userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.city;
        }
     return "Demo City";
    }

public getUserVerified(): string {
    var verification: string;
    
    if (localStorage.getItem('user') !== null) {
        let userProfile = JSON.parse(localStorage.getItem('user'));
        let userVerifiedStatus: string = userProfile.verified;
        return verification = userVerifiedStatus == "1" ? "verified" : "unverified";
    }

    return "unverified";
}

public getUserRole(): string {
     if (localStorage.getItem('user') !== null) {
        let userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.user_role;
    }   
     return "Demo Role";
    }

public getUserJWT(): string {
    if (localStorage.getItem('id_token') !== null) {
        let userJWT: string = JSON.stringify(localStorage.getItem('id_token'));
        userJWT = userJWT.replace('"', '');
        return userJWT;
    }
    return '';
    }

public getUserCityId(): string {
    if (localStorage.getItem('user') !== null) {
        let userProfile: any = JSON.parse(localStorage.getItem('user'));
        console.log('city_id', userProfile.city_id);
        return userProfile.city_id;
    }
    return '21';
    }    
};