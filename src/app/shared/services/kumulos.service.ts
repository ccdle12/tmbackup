import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from './localStorage.service';
import 'rxjs/add/operator/map';

@Injectable()
export class KumulosService {
    
    host : string;
    basePath : string;

    getAllCitiesJSON: string;

    constructor(private http: Http, private localStorageService: LocalStorageService) {
        this.initializeAllInstanceVariables();
    }

    initializeAllInstanceVariables(): void {
        this.host = "https://api.kumulos.com/";
        this.basePath = "b2.2/ee263e29-20c7-471f-92eb-5fe34a19e80f/";

        this.getAllCitiesJSON = "getAllCities.json/"
        
    }

    createAuthorizationHeader(): Headers {
        var headers = new Headers();

        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ZWUyNjNlMjktMjBjNy00NzFmLTkyZWItNWZlMzRhMTllODBmOmx2WElGZUlpQlNkOXErNnVIbXFEUlJrUVA4TzNNVXlKdmV3MA=='); 

        return headers;
    }

    createBody(): String {
        var urlSearchParams: URLSearchParams = new URLSearchParams();
        var userJWT: string = this.localStorageService.getUserJWT();
        urlSearchParams.append('params[jwt]', userJWT);
        var body: string = urlSearchParams.toString()

        return body;
    }

    getAllCities(): any {
        var headers: Headers = this.createAuthorizationHeader();
        var body: String = this.createBody();
        
        return this.http.post(this.host + this.basePath + this.getAllCitiesJSON, body, {headers: headers})
                .map(response => {
                    return response.json()});
                };
}
