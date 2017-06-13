import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TakeSurveyDashboardService {
    
    private activeCityVersion: string;
    private surveyDashboard: Array<JSON>;

    public setActiveCityVersion(activeCityVersion: string) {
        this.activeCityVersion = activeCityVersion;
        console.log('from service',this.activeCityVersion);
    }

    public getActiveCityVersion(): string {
        console.log('takeSurveyDashboard activeCity: ', this.activeCityVersion);
        return this.activeCityVersion;
    }

    public setSurveyDashboard(surveyDashboard: Array<JSON>) {
        this.surveyDashboard = surveyDashboard;
        console.log('from set Survey Dashboard', this.surveyDashboard[0]);
    }

    public getSurveyDashboard(): Array<JSON> {
        return this.surveyDashboard;
    }
}