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
        // this.surveyDashboard = surveyDashboard;
        console.log('take survey dashboard', surveyDashboard);
        localStorage.setItem('surveydashboard', JSON.stringify(surveyDashboard));   
    }

    public getSurveyDashboard(): Array<JSON> {
        return this.surveyDashboard;
    }

    public getObjectFromDashboard(index: number) {
        
        let surveyDashboard = localStorage.getItem('surveydashboard');
        surveyDashboard = JSON.parse(surveyDashboard);
        return surveyDashboard[index];
    }
}