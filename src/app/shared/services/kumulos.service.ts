import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from './localStorage.service';
import 'rxjs/add/operator/map';

@Injectable()
export class KumulosService {
    
    domain: string;
    getAllCitiesURI: string;
    getActiveVersionForCityURI: string;
    getWebDashboardURI: string;

    constructor(private http: Http, private localStorageService: LocalStorageService) {
        this.initializeAllInstanceVariables();
    }

    initializeAllInstanceVariables(): void {
        this.domain = "https://api.kumulos.com/b2.2/ee263e29-20c7-471f-92eb-5fe34a19e80f/";

        this.getAllCitiesURI = "getAllCities.json/"
        this.getActiveVersionForCityURI = "getActiveVersionForCity.json/"
        this.getWebDashboardURI = "webGetDashboard.json/"
    }

    createAuthorizationHeader(): Headers {
        let headers = new Headers();

        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ZWUyNjNlMjktMjBjNy00NzFmLTkyZWItNWZlMzRhMTllODBmOmx2WElGZUlpQlNkOXErNnVIbXFEUlJrUVA4TzNNVXlKdmV3MA=='); 

        return headers;
    }

    createBody(): URLSearchParams {
        let urlSearchParams: URLSearchParams = new URLSearchParams();

        let userJWT: string = this.localStorageService.getUserJWT();
        urlSearchParams.append('params[jwt]', userJWT);
        
        return urlSearchParams;
    }

    getAllCities(): any {
        let headers: Headers = this.createAuthorizationHeader();
        let urlSearchParams: URLSearchParams = this.createBody();
        let body: String = urlSearchParams.toString();
        
        return this.http.post(this.domain + this.getAllCitiesURI, body, {headers: headers})
                .map(response => {
                    return response.json()
                });
    };

    getActiveVersionForCity(): any {
        let headers: Headers = this.createAuthorizationHeader();
        let urlSearchParams: URLSearchParams = this.createBody();

         urlSearchParams.append('params[cityID]', this.localStorageService.getUserCityId());

         let body: String = urlSearchParams.toString();

         return this.http.post(this.domain + this.getActiveVersionForCityURI, body, {headers: headers})
                .map(response => {
                    return response.json()
        });
    }

    getWebDashboard(activeVersionNumber: string): any {
        var headers: Headers = this.createAuthorizationHeader();
        var urlSearchParams: URLSearchParams = this.createBody();
        var activeVersionNumber = this.localStorageService.getUserCityId();
        
        urlSearchParams.append('params[version]', activeVersionNumber);

        var body: String = urlSearchParams.toString();

        return this.http.post(this.domain + this.getWebDashboardURI, body, {headers: headers})
            .map(response => {
                    return response.json()
            });
    }
}
