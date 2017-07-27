import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { MdSliderModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule} from '@angular/material';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { EvidenceService } from '../../../../shared/services/evidence.service';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements AfterViewInit { 

    evidence: JSON[];
    currentDimension: string;

    constructor(public kumulos: KumulosService, public router: Router, public evidenceService: EvidenceService,
                public dialog: MdDialog) {
        let parsedSurveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));

        let userSelectedModule = Number(localStorage.getItem('userSelectedModule'));

        let areaID = parsedSurveyDashboard[userSelectedModule]['areaID'];
        let dimensionID = parsedSurveyDashboard[userSelectedModule]['dimensionID'];

        let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));
        let userID = userProfile['user_id'];

        let activeCityVersion = localStorage.getItem('activeCityVersion');

        this.kumulos.getWebGetEvidence(activeCityVersion, areaID, dimensionID).subscribe(responseJSON => {
            this.evidence = responseJSON.payload;
            console.log(responseJSON);

            let evidenceID = "";
            
            if (responseJSON.payload) {
              evidenceID = responseJSON.payload[0]['evidenceID'];
            }

            this.setEvidenceService(activeCityVersion, areaID, dimensionID, evidenceID, userID);
        });

        this.updateCurrentDimension();
    }

    ngAfterViewInit() {
      console.log("ngOnInit called");
     
    }

    private setEvidenceService(version: string, areaID: string, dimensionID: string, evidenceID: string, userID: string) {
      this.evidenceService.setActiveVersion(version);
      this.evidenceService.setAreaID(areaID);
      this.evidenceService.setDimensionID(dimensionID);
      this.evidenceService.setEvidenceID(evidenceID);
      this.evidenceService.setUserID(userID);
    }

    private updateCurrentDimension(): void {
     let surveydashboard: JSON = JSON.parse(localStorage.getItem('surveydashboard'));
     let userSelectedModule: number = Number(JSON.parse(localStorage.getItem('userSelectedModule')));

     let dimensionText: string = surveydashboard[userSelectedModule]['dimensionText'];

     this.currentDimension = dimensionText;
    }

     public routeToPage(surveyPage: String) {
        switch(surveyPage) {
          case('survey'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/survey');
            break;
          case ('evidence'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/evidence');
            break;
          case ('bestPractice'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/bestpractice');
            break;
          case ('caseStudies'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/casestudies');
            break;
        }
    }

  public backToTakeSurvey(): void {
    this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/main/takesurvey'));
  }

  public launchEvidenceDialog() {
    this.dialog.open(EvidenceDialog);
  }

  public launchDeleteEvidenceDialog() {
    this.dialog.open(DeleteEvidenceDialog);
  }
}

@Component({
  selector: 'newEvidence',
  templateUrl: '../../../../shared/dialogs/newEvidence.html',
  styleUrls: ['../../../../shared/dialogs/newEvidence.css']
})
export class EvidenceDialog {

  addNewEvidence: FormGroup;
  httpRequestFlag: boolean;

  constructor(public dialog: MdDialog, public formBuilder: FormBuilder, public kumulosService: KumulosService, public evidenceService: EvidenceService, public router: Router) 
  {
    this.addNewEvidence = this.formBuilder.group({
      evidenceTitle: ['', Validators.required],
      evidenceDescription: ['', Validators.required],
      evidenceReference: ['', Validators.required],
    });
  }

  public createUpdateEvidence() {
    let evidenceData: string = this.evidenceService.getEvidenceData(this.addNewEvidence.value.evidenceTitle, this.addNewEvidence.value.evidenceDescription);
    console.log("calling update evidence");
    this.httpRequestFlag = true;
    this.kumulosService.createUpdateEvidence(evidenceData)
      .subscribe(response =>
        {
          console.log("response from update evidence");
          console.log(response);
          this.closeDialog();
          this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/main/takesurvey/surveymodule/evidence'));
        })
  }

  private closeDialog() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'deleteEvidence',
  templateUrl: '../../../../shared/dialogs/deleteEvidence.html',
  styleUrls: ['../../../../shared/dialogs/deleteEvidence.css']
})
export class DeleteEvidenceDialog {

  addNewEvidence: FormGroup;
  httpRequestFlag: boolean;

  constructor(public dialog: MdDialog, public formBuilder: FormBuilder, public kumulosService: KumulosService, public evidenceService: EvidenceService, public router: Router) 
  {
 
  }

  public deleteEvidence() 
  {
    this.httpRequestFlag = true;
    this.kumulosService.deleteEvidence(this.evidenceService.getEvidenceID())
      .subscribe(response => 
      {
        console.log(response);
        this.closeDialog();
        this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/main/takesurvey/surveymodule/evidence'));
      })
  }

  private closeDialog() 
  {
    this.dialog.closeAll();
  }
}