import { Component, OnInit, ViewChild} from '@angular/core';
import { TakeSurveyDashboardService } from '../../../../shared/services/takeSurveyDashboard.service';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { MdSliderModule, MdSidenavModule  } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';


@Component({
  selector: 'customerEngagementSurvey',
  templateUrl: './customerEngagementSurvey.component.html',
  styleUrls: ['./customerEngagementSurvey.component.css']
})
export class SurveyComponent implements OnInit {

    private activeCityVersion: string;
    public surveyQuestions: Array<JSON>;

    private importanceValues: Array<any>;
    private importanceToolTips: Array<string>;

    private capabilityValues: Array<any>;
    private capabilityToolTips: any[];

    private twoYearTargetValues: Array<any>;

    private surveyCount: any;

    private areaID: any;
    private dimensionID: any;
    public dimensionText: any;

    private userSaved: boolean;

    private userSelectedModule: any;

    private sizeOfModules: number;

    constructor(public takeSurveyService: TakeSurveyDashboardService, 
                public kumulosService: KumulosService, 
                public router: Router,
                public dialog: MdDialog,
                public authService: AuthService) { 
      
     this.userSelectedModule = localStorage.getItem('userSelectedModule');
    }
                
    @ViewChild('start') sidenav: MdSidenavModule;

    ngOnInit() {

      let surveyDashboard: JSON = JSON.parse(localStorage.getItem('surveydashboard'));
      this.sizeOfModules = Object.keys(surveyDashboard).length - 1;

      this.userSaved = false;

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
      this.areaID = parsedSurveyDashboard[this.userSelectedModule]['areaID'];
      this.dimensionID = parsedSurveyDashboard[this.userSelectedModule]['dimensionID'];
      this.dimensionText = parsedSurveyDashboard[this.userSelectedModule]['dimensionText'];

      this.activeCityVersion = localStorage.getItem('activeCityVersion');

      this.getWebSurveyQuestions(); 
    }

    private getWebSurveyQuestions() {
      this.kumulosService.getWebSurvey(this.activeCityVersion, this.areaID, this.dimensionID )
        .subscribe(responseJSON => {
         this.surveyQuestions = responseJSON.payload;
         console.log('looking for data', responseJSON);
         console.log('survey question length: ', this.surveyQuestions.length);
         
         this.updateToolTipsAndSurveyValues();
         console.log('survey questions', responseJSON.payload); 
      });
  }
    
    private updateToolTipsAndSurveyValues(): void {
      var tempArray = new Array();

      for (var eachQuestion = 0; eachQuestion < this.surveyQuestions.length; eachQuestion++) {
        
        if (this.surveyQuestions[eachQuestion]['importance'] == " " || this.surveyQuestions[eachQuestion]['importance'] == "0") {
          this.importanceValues[eachQuestion] = " ";
        } else {
          this.importanceValues[eachQuestion] = this.surveyQuestions[eachQuestion]['importance'];
        }

         if (this.surveyQuestions[eachQuestion]['score'] == " " || this.surveyQuestions[eachQuestion]['score'] == "0") {
          this.capabilityValues[eachQuestion] = " ";
        } else {
          this.capabilityValues[eachQuestion] = this.surveyQuestions[eachQuestion]['score'];
        }

        if (this.surveyQuestions[eachQuestion]['target'] == " " || this.surveyQuestions[eachQuestion]['target'] == "0") {
          this.capabilityValues[eachQuestion] = " ";
        } else {
        this.twoYearTargetValues[eachQuestion] = this.surveyQuestions[eachQuestion]['target'];
        }

        for (var scoreText = 1; scoreText <= 5; scoreText++) {
          tempArray[scoreText] = scoreText + " - " + this.surveyQuestions[eachQuestion]['scoringID' + scoreText + 'Text'];  
        }

        this.capabilityToolTips.push(tempArray);
        tempArray = [];
      }
    }

  public backToTakeSurvey(): void {
    window.location.reload();
    this.router.navigateByUrl('/main/takesurvey');
  }

  public saveSurveyInput(): void {
    console.log('saveSurveyClicked');

    if (this.authService.inDemoMode()) {
      this.dialog.open(InDemoModeDialog);
      return;
    }

    this.userSaved = true;
    this.updateSurveyData();
  }

  public nextModule(): void {
    if (this.authService.inDemoMode()) {
      let userSelectedModule: number = parseInt(localStorage.getItem('userSelectedModule'));
      let incrementUserSelectedModule = userSelectedModule += 1;

      localStorage.setItem('userSelectedModule', incrementUserSelectedModule.toString());

      window.location.reload();
      return;    
    }

    if (!this.userSaved) {
      this.dialog.open(RemindUserToSaveDialog);
      return;
    }

    let userSelectedModule: number = parseInt(localStorage.getItem('userSelectedModule'));
      let incrementUserSelectedModule = userSelectedModule += 1;

      localStorage.setItem('userSelectedModule', incrementUserSelectedModule.toString());

      window.location.reload();
  }

  public previousModule(): void {
    let userSelectedModule: number = parseInt(localStorage.getItem('userSelectedModule'));

    let incrementUserSelectedModule = userSelectedModule -= 1;

    localStorage.setItem('userSelectedModule', incrementUserSelectedModule.toString());

    window.location.reload();
    return;    
  }

  public notAtStartOfModules(): boolean {
    let userSelectedModule: number = parseInt(localStorage.getItem('userSelectedModule'));
    if (userSelectedModule == 0) {
      return false;
    }

    return true;
  }

  public notAtEndOfModules(): boolean {
    let userSelectedModule: number = parseInt(localStorage.getItem('userSelectedModule'));
    
    if (userSelectedModule == this.sizeOfModules) {
      return false;
    }

    return true;
  }

  public updateSurveyData(): void {
    
    var activeCityVersion = localStorage.getItem('activeCityVersion');
    var JsonArray = new Array();

    for (var eachQuestion = 0; eachQuestion < this.surveyQuestions.length; eachQuestion++) {
      var userSurveyID = this.surveyQuestions[eachQuestion]['userSurveyID'];
      var statementID = this.surveyQuestions[eachQuestion]['statementID'];
      var dimensionID = this.surveyQuestions[eachQuestion]['dimensionID'];
      var areaID = this.surveyQuestions[eachQuestion]['areaID'];

      var importanceScore = this.importanceValues[eachQuestion];
      var asIsCapabilityScore = this.capabilityValues[eachQuestion];
      var targetScore = this.twoYearTargetValues[eachQuestion];

      var surveyJsonObject = {"areaID":areaID,"dimensionID": dimensionID,"statementID": statementID,"importance": importanceScore,"score": asIsCapabilityScore,"target": targetScore,"version": activeCityVersion,"userSurveyID": userSurveyID};
      console.log('customerEnagementSurvey: ', surveyJsonObject);
      JsonArray.push({"areaID":areaID,"dimensionID": dimensionID,"statementID": statementID,"importance": importanceScore,"score": asIsCapabilityScore,"target": targetScore,"version": activeCityVersion,"userSurveyID": userSurveyID});
    }

    let hardCodeJson = {"surveyData": JsonArray };
    let surveyDataString = JSON.stringify(hardCodeJson);

    this.kumulosService.getCreateUpdateUserSurveyData(surveyDataString)
      .subscribe(responseJSON => {} );
  }

    public activeBackgroundColor() {
        return { 'background-color': '#1e90ff',
                  'color': 'white' };
    }
}

@Component({
  selector: 'remindUserToSave-dialog',
  templateUrl: 'remindUserToSaveDialog.html',
})
export class RemindUserToSaveDialog { }

@Component({
  selector: 'inDemoMode-dialog',
  templateUrl: 'inDemoMode.html',
})
export class InDemoModeDialog { }
