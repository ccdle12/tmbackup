import { Injectable }      from '@angular/core';

@Injectable()
export class LocalStorageService {

public getUserName(): string {
    if (localStorage.getItem('user') !== null) {
        var userName = JSON.parse(localStorage.getItem('userName'));
        return userName;
    }
    return "Demo User";
  }

public getUserCity(): string {
    if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.city;
        }
     return "Demo City";
    }

public getUserVerified(): string {
    var verification: string;
    
    if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        var userVerifiedStatus: string = userProfile.verified;
        return verification = userVerifiedStatus == "1" ? "verified" : "unverified";
    }

    return "unverified";
}

public getUserRole(): string {
     if (localStorage.getItem('user') !== null) {
        var userProfile = JSON.parse(localStorage.getItem('user'));
        return userProfile.user_role;
    }   
     return "Demo Role";
    }
};