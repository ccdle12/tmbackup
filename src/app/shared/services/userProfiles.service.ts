import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProfilesService {
    
    managementToken : string;
    userProfilesURL : string;

    constructor(private http: Http) {
        this.managementToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxSTAyUnA3dm9GR29yR25kdHRWQXduU2RIcmhHS2NsWCIsInNjb3BlcyI6eyJ1c2Vyc19hcHBfbWV0YWRhdGEiOnsiYWN0aW9ucyI6WyJyZWFkIiwidXBkYXRlIiwiZGVsZXRlIiwiY3JlYXRlIl19LCJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiLCJjcmVhdGUiXX19LCJpYXQiOjE0Nzg4NzE3OTIsImp0aSI6IjUwMDUwM2FlYzg2MDg0YzRhYzQ1NjZkMzVjNDZjODg0In0.70GxPAo1YT6VpSgxDIyM1bdYdzdNRrxN5E9xm-vVS1A";
        this.userProfilesURL = "https://tmforum.eu.auth0.com/api/v2/users";
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Bearer ' + this.managementToken); 
    }

    getUserProfiles() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        
        return this.http.get(this.userProfilesURL, { headers: headers})
                .map(response => response.json());
    }
}