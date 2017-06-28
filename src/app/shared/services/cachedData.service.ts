import { Injectable }      from '@angular/core';
// import { Router }          from '@angular/router';
// import { tokenNotExpired } from 'angular2-jwt';
// import auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';

// declare var Auth0Lock: any;

@Injectable()
export class CachedDataService {
    public verified: string;
    public metaData: string;
    public fullName: string;
    public picture: string;
    public email: string;
}