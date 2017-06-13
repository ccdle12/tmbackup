import { Component, OnInit } from '@angular/core';
import { TakeSurveyDashboardService } from '../../../../shared/services/takeSurveyDashboard.service';
import { KumulosService } from '../../../../shared/services/kumulos.service';

@Component({
  selector: 'customerEngagementSurvey',
  templateUrl: './customerEngagementSurvey.component.html',
  styleUrls: ['./customerEngagementSurvey.component.css']
})
export class CustomerEngagementSurveyComponent implements OnInit {

    private activeCityVersion: string;
    private surveyQuestions: Array<JSON>;
    private areaID: string;
    private dimensionID: string;

    constructor(public takeSurveyService: TakeSurveyDashboardService, public kumulosService: KumulosService) {
   
    }

    ngOnInit() {
      this.activeCityVersion = this.takeSurveyService.getActiveCityVersion();
      console.log('test', this.activeCityVersion);
      let surveyDashboard: Array<JSON> = this.takeSurveyService.getSurveyDashboard();
      console.log('test',this.takeSurveyService.getSurveyDashboard());
      // console.log('test', surveyDashboard[0]);
      // let customerEngagement: JSON = surveyDashboard[0];

      // this.areaID = surveyDashboard[0]['areaID'];
      // this.dimensionID = surveyDashboard[0]['dimensionID'];

      this.getWebSurveyQuestions(); 
    }

    getWebSurveyQuestions() {
      this.kumulosService.getWebSurvey(this.activeCityVersion, this.areaID, this.dimensionID )
        .subscribe(responseJSON => {
         this.surveyQuestions = responseJSON.payload;
         console.log('survey questions', responseJSON.payload); 
      });
  }

  getActiveCityVersion(): string {
    return this.takeSurveyService.getActiveCityVersion();
  }
}
