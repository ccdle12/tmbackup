import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from './localStorage.service';
import { AuthService } from '../../shared/services/auth.service'
import 'rxjs/add/operator/map';

@Injectable()
export class KumulosService {
    
    private domain: string;
    private getAllCitiesURI: string;
    private getActiveVersionForCityURI: string;
    private getWebDashboardURI: string;
    private getWebSurveyURI: string;
    private getDemoCityURI: string;
    private getDemoUserJWTURI: string;

    constructor(private http: Http, private localStorageService: LocalStorageService, public authService: AuthService) {
        this.initializeAllInstanceVariables();
    }

    public initializeAllInstanceVariables(): void {
        this.domain = "https://api.kumulos.com/b2.2/ee263e29-20c7-471f-92eb-5fe34a19e80f/";

        this.getAllCitiesURI = "getAllCities.json/";
        this.getActiveVersionForCityURI = "getActiveVersionForCity.json/";
        this.getWebDashboardURI = "webGetDashboard.json/";
        this.getWebSurveyURI = "/webGetSurvey.json/";
        this.getDemoCityURI = "/getDemoCityID.json/";
        this.getDemoUserJWTURI = "/getDemoUserJWT.json";
    }

    public createAuthorizationHeader(): Headers {
        let headers = new Headers();

        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ZWUyNjNlMjktMjBjNy00NzFmLTkyZWItNWZlMzRhMTllODBmOmx2WElGZUlpQlNkOXErNnVIbXFEUlJrUVA4TzNNVXlKdmV3MA=='); 

        return headers;
    }

    public createBody(): URLSearchParams {
        let urlSearchParams: URLSearchParams = new URLSearchParams();

        let userJWT: string = this.localStorageService.getUserJWT();   

        //Replace value below for testing w/ C0tham1969' to show values from kumulos updating the sliders 
        urlSearchParams.append('params[jwt]', userJWT);
    
        return urlSearchParams;
    }

    public getAllCities(): any {
        let headers: Headers = this.createAuthorizationHeader();
        let urlSearchParams: URLSearchParams = this.createBody();
        let body: String = urlSearchParams.toString();
        
        return this.http.post(this.domain + this.getAllCitiesURI, body, {headers: headers})
                .map(response => {
                    return response.json()
                });
    };

    public getActiveVersionForCity(): any {
        let headers: Headers = this.createAuthorizationHeader();
        let urlSearchParams: URLSearchParams = this.createBody();

         urlSearchParams.append('params[cityID]', this.localStorageService.getUserCityId());

         let body: String = urlSearchParams.toString();

         return this.http.post(this.domain + this.getActiveVersionForCityURI, body, {headers: headers})
                .map(response => {
                    return response.json()
        });
    }

    public getWebDashboard(activeVersionNumber: string): any {
        let headers: Headers = this.createAuthorizationHeader();
        let urlSearchParams: URLSearchParams = this.createBody();
        
        console.log('kumulos get web dashboard', 'active version number: ' + activeVersionNumber);
        urlSearchParams.append('params[version]', activeVersionNumber);

        var body: String = urlSearchParams.toString();

        return this.http.post(this.domain + this.getWebDashboardURI, body, {headers: headers})
            .map(response => {
                    return response.json();
            });
    }

    public getWebSurvey(activeVersionNumber: string, areaID: string, dimensionID: string): any {
        let headers: Headers = this.createAuthorizationHeader();
        let urlSearchParams: URLSearchParams = this.createBody();
        
        urlSearchParams.append('params[version]', activeVersionNumber);
        urlSearchParams.append('params[areaID]', areaID);
        urlSearchParams.append('params[dimensionID]', dimensionID);

        let body: String = urlSearchParams.toString();

        return this.http.post(this.domain + this.getWebSurveyURI, body, {headers: headers})
            .map(response => {
                return response.json();
            });
    }

    public getDemoCity() {
        let headers: Headers = this.createAuthorizationHeader();

        return this.http.post(this.domain + this.getDemoCityURI, null, {headers: headers})
            .map(response => {
                console.log(response.json());
                return response.json();
            });
    }

    public getDemoUserJWT() {
        let headers: Headers = this.createAuthorizationHeader();

        return this.http.post(this.domain + this.getDemoUserJWTURI, null, {headers: headers})
            .map(response => {
                console.log(response.json());
                return response.json();
            });
    }


}
