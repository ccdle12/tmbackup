import { Component, OnInit } from '@angular/core';
import { TakeSurveyDashboardService } from '../../../../shared/services/takeSurveyDashboard.service';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { MdSliderModule } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'customerExperienceSurvey',
  templateUrl: './customerExperienceSurvey.component.html',
  styleUrls: ['./customerExperienceSurvey.component.css']
})
export class CustomerExperienceSurveyComponent implements OnInit {

    private activeCityVersion: string;
    private surveyQuestions: Array<JSON>;

    private importanceValues: Array<any>;
    private importanceToolTips: Array<string>;

    private capabilityValues: Array<any>;
    private capabilityToolTips: any[];

    private twoYearTargetValues: Array<string>;;

    constructor(public takeSurveyService: TakeSurveyDashboardService, public kumulosService: KumulosService, public router: Router) { }

    ngOnInit() {
      //Update importance values with the data from kumulos
      this.importanceValues = new Array();

      this.importanceToolTips = new Array();
      this.importanceToolTips[0] = "1 - Little Importance";
      this.importanceToolTips[1] = "2 - Some Importance";
      this.importanceToolTips[2] = "3 - Generally Important";
      this.importanceToolTips[3] = "4 - Significant Importance";
      this.importanceToolTips[4] = "5 - Key/pivotal priority";

      this.capabilityValues = new Array();
      this.capabilityToolTips = new Array();

      this.twoYearTargetValues = new Array();

      this.getWebSurveyQuestions(); 
    }

    private getWebSurveyQuestions() {
      this.kumulosService.getWebSurvey(this.getActiveCityVersion(), '1', '1.2' )
        .subscribe(responseJSON => {
         this.surveyQuestions = responseJSON.payload;
         
         this.updateCapabilityToolTips();
         console.log('survey questions from customer experience', responseJSON.payload); 
      });
  }

    private updateCapabilityToolTips(): void {
      var tempArray = new Array();

      for (var i = 0; i <= 10; i++) {
        for (var j = 1; j <= 5; j++) {
          tempArray[j] = j + " - " + this.surveyQuestions[i]['scoringID' + j + 'Text'];  
        }
        this.capabilityToolTips.push(tempArray);
        tempArray = [];
      }
    }

  public getActiveCityVersion(): string {
    return this.takeSurveyService.getActiveCityVersion();
  }

  public backToTakeSurvey(): void {
    this.router.navigateByUrl('/main/takesurvey');
  }

  public nextModule(): void {
    this.router.navigateByUrl('/main/takesurvey/customerexperience');
  }

  public previousModule(): void {
    this.router.navigateByUrl('/main/takesurvey/customerengagement');
  }
}
