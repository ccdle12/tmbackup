import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
import { MdSnackBar } from '@angular/material';


@Component({
  selector: 'app-takesurvey',
  templateUrl: './takeSurvey.component.html',
  styleUrls: ['./takeSurvey.component.css']
})
export class TakeSurveyComponent {

  private takeSurveyDashboard: Array<JSON>;
  public indexModuleSelected: any;

  constructor(public router: Router, public kumulosService: KumulosService) {
    
    let activeCityVersion: string = localStorage.getItem('activeCityVersion');
    this.getWebDashboard(activeCityVersion);
  }

  private getWebDashboard(activeCityVersion: string): void {
    this.kumulosService.getWebDashboard(activeCityVersion)
      .subscribe(responseJSON => { 
        localStorage.setItem('surveydashboard', JSON.stringify(responseJSON.payload));
        this.takeSurveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));
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


