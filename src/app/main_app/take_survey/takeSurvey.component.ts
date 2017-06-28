import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
// import { CustomerEngagementComponent } from './survey_module/customerEngagement.component';
import { TakeSurveyDashboardService } from '../../shared/services/takeSurveyDashboard.service'


@Component({
  selector: 'app-takesurvey',
  templateUrl: './takeSurvey.component.html',
  styleUrls: ['./takeSurvey.component.css']
})
export class TakeSurveyComponent implements OnInit {

  private takeSurveyDashboard: Array<JSON>;
  public indexModuleSelected: any;

  constructor(public router: Router, public kumulosService: KumulosService, public takeSurveyService: TakeSurveyDashboardService) {
    this.intializeInstanceVariables();
    this.getActiveVersionForCity();
  }

  ngOnInit() {}

  private intializeInstanceVariables(): void {
     this.takeSurveyDashboard = new Array();
  }

  private getActiveVersionForCity(): void {
    
    this.kumulosService.getActiveVersionForCity()
      .subscribe(responseJSON => {
        console.log("Why is the responseJSON Null?", responseJSON);
        let activeCityVersion: string = responseJSON.payload;
        console.log('get active city cached', activeCityVersion);
        localStorage.setItem('activeCityVersion', activeCityVersion);

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
  
  public inChildComponents(): boolean {
        let currentUrl = this.router.url;

        let urlRegex = '(\/takesurvey\/.*)'
        if (currentUrl.match(urlRegex)) {
            return false;
        }
        return true;
  }

  public navigateToSurveyModule(index: number) {

    this.indexModuleSelected = index;
    localStorage.setItem('userSelectedModule', index.toString());
    console.log("index module: ", this.indexModuleSelected);
    this.router.navigateByUrl('/main/takesurvey/surveymodule');
  }

  public changeSurveyProgressBackground(index: number): any {
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
