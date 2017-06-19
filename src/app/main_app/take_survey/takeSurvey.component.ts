import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
import { CustomerEngagementComponent } from './customer_engagement/customerEngagement.component';
import { TakeSurveyDashboardService } from '../../shared/services/takeSurveyDashboard.service'


@Component({
  selector: 'app-takesurvey',
  templateUrl: './takeSurvey.component.html',
  styleUrls: ['./takeSurvey.component.css']
})
export class TakeSurveyComponent {

  private takeSurveyDashboard: Array<JSON>;

  constructor(public router: Router, public kumulosService: KumulosService, public takeSurveyService: TakeSurveyDashboardService) {
    this.intializeInstanceVariables();
    this.getActiveVersionForCity();
 
  }

  private intializeInstanceVariables(): void {
     this.takeSurveyDashboard = new Array();
  }

  private getActiveVersionForCity(): void {
    this.kumulosService.getActiveVersionForCity()
      .subscribe(responseJSON => {
        
        let activeCityVersion: string = responseJSON.payload;
        // console.log('takeSurvey', activeCityVersion);
        this.takeSurveyService.setActiveCityVersion(activeCityVersion);

        this.getWebDashboard(activeCityVersion);
      });
  }

  private getWebDashboard(activeCityVersion: string): void {
    this.kumulosService.getWebDashboard(activeCityVersion)
      .subscribe(responseJSON => { 
        this.takeSurveyDashboard = responseJSON.payload;
        console.log('take survey dashboard', responseJSON.payload);
        this.takeSurveyService.setSurveyDashboard(responseJSON.payload);
    });
  }
  
  private inChildComponents(): boolean {
        let currentUrl = this.router.url;

        let urlRegex = '(\/takesurvey\/.*)'
        if (currentUrl.match(urlRegex)) {
            return false;
        }
        return true;
  }

  public navigateToSurveyModule(index: number) {
    switch(index) {
      case 0:
        this.router.navigateByUrl('/main/takesurvey/customerengagement');
        console.log('user clicked on customerengagement');
        break;

      case 1:
        this.router.navigateByUrl('/main/takesurvey/customerexperience');
        console.log('user clicked on customerexperience');
        break;
    }
    
  }

  public changeBackground(index: number): any {
    let surveyCount = this.takeSurveyDashboard[index]['surveyCount'];
    let statementCount = this.takeSurveyDashboard[index]['statementCount'];
    if (surveyCount == 0) {
      return { 'background-color': 'grey' };
    }
    else if (surveyCount < statementCount) {
      return { 'background-color': 'red' };
    }
    else {
      return { 'background-color': 'lightgreen' };
    }    
    
  } 
}
