import { Injectable }      from '@angular/core';

@Injectable()
export class LocalStorageService {

public getUserName(): string {
    if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.given_name + " " + userProfile.family_name;
    }

    return "Demo User";
  }

public getUserCity(): string {
    if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.app_metadata.city;
        }
     return "Demo City";
    }

public getUserVerified(): string {
    var verification: string;
    
    if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        var userVerifiedStatus: string = userProfile.app_metadata.verified;

        return verification = userVerifiedStatus == "1" ? "verified" : "unverified";
    }

    return "unverified";
}

public getUserRole(): string {
     if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.app_metadata.user_role;
     }
     
     return "Demo Role";
    }
};