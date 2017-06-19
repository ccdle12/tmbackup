import { Component, OnInit, ViewChild} from '@angular/core';
import { TakeSurveyDashboardService } from '../../../../shared/services/takeSurveyDashboard.service';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { MdSliderModule, MdSidenavModule  } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'customerEngagementSurvey',
  templateUrl: './customerEngagementSurvey.component.html',
  styleUrls: ['./customerEngagementSurvey.component.css']
})
export class CustomerEngagementSurveyComponent implements OnInit {

    private activeCityVersion: string;
    private surveyQuestions: Array<JSON>;

    private importanceValues: Array<any>;
    private importanceToolTips: Array<string>;

    private capabilityValues: Array<any>;
    private capabilityToolTips: any[];

    private twoYearTargetValues: Array<string>;

    private surveyCount: any;

    private areaID: any;
    private dimensionID: any;
    private dimensionText: any;

    constructor(public takeSurveyService: TakeSurveyDashboardService, 
                public kumulosService: KumulosService, 
                public router: Router) { }
                
    @ViewChild('start') sidenav: MdSidenavModule;

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

      let parsedSurveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));
      this.areaID = parsedSurveyDashboard[0]['areaID'];
      this.dimensionID = parsedSurveyDashboard[0]['dimensionID'];
      this.dimensionText = parsedSurveyDashboard[0]['dimensionText'];

      this.getWebSurveyQuestions(); 
    }

     public routeToPage(surveyPage: String) {
       console.log('routetoPage activated: ' + surveyPage);
        switch(surveyPage) {
          case('survey'):
            this.router.navigateByUrl('main/takesurvey/customerengagement/survey');
            break;
          case ('evidence'):
            this.router.navigateByUrl('main/takesurvey/customerengagement/evidence');
            break;
          case ('bestPractice'):
            this.router.navigateByUrl('main/takesurvey/customerengagement/bestpractice');
            break;
          case ('caseStudies'):
            this.router.navigateByUrl('main/takesurvey/customerengagement/casestudies');
            break;
        }
    }

    private getWebSurveyQuestions() {
      this.kumulosService.getWebSurvey(this.getActiveCityVersion(), this.areaID, this.dimensionID )
        .subscribe(responseJSON => {
         this.surveyQuestions = responseJSON.payload;
         
         this.updateCapabilityToolTips();
         console.log('survey questions', responseJSON.payload); 
      });
  }

    private updateCapabilityToolTips(): void {
      var tempArray = new Array();

      for (var i = 0; i <= 5; i++) {
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
    this.router.navigateByUrl('/main/takesurvey/customerexperience')
  }
}
