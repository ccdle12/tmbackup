import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
import { MatSnackBar, MatProgressBar, MatDialog, MatTooltip, MAT_DIALOG_DATA} from '@angular/material';
import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StylingService } from '../../shared/services/styling.service';


@Component({
  selector: 'app-takesurvey',
  templateUrl: './takeSurvey.component.html',
  styleUrls: ['./takeSurvey.component.css']
})
export class TakeSurveyComponent {

  private takeSurveyDashboard: Array<JSON>;
  public indexModuleSelected: any;

  private totalProgress: JSON;
  public progressValue: number;

  public surveyModules: Array<any>;
  public sectionModules: Array<any>;

  public innerLoopIndex: number;

  constructor(public router: Router, 
              public authService: AuthService, 
              public loadingSnackBar: LoadingSnackBar, 
              public kumulosService: KumulosService,
              public dialog: MatDialog,
              public stylingService: StylingService) {
    
    this.surveyModules = new Array();
    this.sectionModules = new Array();

    let activeCityVersion: string = localStorage.getItem('activeCityVersion');
    console.log("Active Version From Localstorage before call?")
    console.log(activeCityVersion);

    this.inDemoOrInMainApp();

    this.loadingSnackBar.showLoadingSnackBar();
    this.getActiveVersionForCity();
    this.hasUserAnsweredProfiling();
  }

  public navStyle() 
  {
      return {'background-color': this.stylingService.getPrimaryColour('grey')}
  }

  private hasUserAnsweredProfiling() {
    // let version = this.getActiveVersionForCity();
    console.log("CALLING IF USER HAS ANSWERED PROFILE!");
    
    let version = localStorage.getItem("activeCityVersion");

    this.kumulosService.getUserProfileCount(version)
      .subscribe(response => {
        console.log("PAYLOAD FOR USER PROFILE COUNT");
        console.log(response.payload);

        if (response.payload === 0) {
          console.log("User has not DONE PROFILE");
          localStorage.setItem("user_profiling", response.payload);

          // SHOW A MODAL
          if (!this.authService.isAdmin() && !this.authService.isSuperUser()) {
            let dialogRef = this.dialog.open(UserProfilingModal);
          }
          
          // SHOW HTML BOXES THAT CAN'T BE ACCESSED?
          // FLAG IN THE HTML?
          
        } else {
          localStorage.setItem("user_profiling", response.payload);
        }
      })
  }

  public showSurveyModal() {
    let dialogRef = this.dialog.open(UserProfilingModal);
  }

  public getUserSurveyCount() {
    let user_profiling = localStorage.getItem("user_profiling");
    console.log("User PRofiling: ")
    console.log(user_profiling);

    if (Number(user_profiling) > 0 || this.authService.isAdmin() || this.authService.isSuperUser())
      return true;
    else
      return false;
  }

  //Fix for user going straight to take survey
  private inDemoOrInMainApp(): void {
        if (this.isUserUnverifiedOrTokenExpired())
            this.getDemoCity();
        else {
            this.getActiveVersionForCity(); 
        }
    }

     private isUserUnverifiedOrTokenExpired() {
        return !this.authService.isVerified() || !this.authService.isAuthenticated() ? true : false;
    }

    private getDemoCity(): void {
        this.kumulosService.getDemoCity()
            .subscribe(response => { 
                localStorage.setItem('demoCity', response.payload);
                this.getDemoUserJWT();
            });
    }

     private getDemoUserJWT(): void {
        this.kumulosService.getDemoUserJWT()
            .subscribe(response => { 
                localStorage.setItem('demoJWT', response.payload);
                this.getActiveVersionForCity(); 
        });
    }
    //Fix for user going straight to take survey

  private getActiveVersionForCity(): void {
        this.kumulosService.getActiveVersionForCity()
        .subscribe(responseJSON => {
            let activeCityVersion: string = responseJSON.payload;
            localStorage.setItem('activeCityVersion', activeCityVersion);

            this.getWebDashboard(activeCityVersion);
        });
    }

  private getWebDashboard(activeCityVersion: string): void {
    this.kumulosService.getWebDashboard(activeCityVersion)
      .subscribe(responseJSON => { 
        localStorage.setItem('surveydashboard', JSON.stringify(responseJSON.payload));

        this.takeSurveyDashboard = responseJSON.payload;

        if (responseJSON.payload) {
          this.removeTotalFromDashboard();
          this.calculateProgressValue();
          this.addModules(this.takeSurveyDashboard.length - 1);
          this.loadingSnackBar.dismissLoadingSnackBar();

          //SHORT TERM SOLUTION - SURVEY MODULES ARE DUPLICATED, DOUBLE ENTRIES
          //SO ONLY RETURNING THE MODULES NEEDED
          this.surveyModules = this.surveyModules.slice(0, 5);
        }
    });
  }

  private removeTotalFromDashboard(): void {
    this.totalProgress = this.takeSurveyDashboard.pop();
  }

  public calculateProgressValue(): void {
    let statementCount: number = this.totalProgress['statementCount'];
    let surveyCount: number = this.totalProgress['surveyCount'];


    if (!statementCount || !surveyCount)
      this.progressValue = 0;
    else
      this.progressValue = Math.round((surveyCount/statementCount) * 100);

      if (this.progressValue > 100) 
        this.progressValue = 100;
      
      console.log("progressValue: ", this.progressValue);
      
  }

  public inChildComponents(): boolean {
    let currentUrl = this.router.url;

    let urlRegex = '(\/takesurvey\/.*)';

    return !currentUrl.match(urlRegex) ? true : false;
  }

  public navigateToSurveyModule(outerIndex: number, innerIndex: number) {

    this.indexModuleSelected = this.calculateIndexPosition(outerIndex, innerIndex);

    this.storeSelectedModule();

    this.router.navigateByUrl('/main/takesurvey/surveymodule/survey');
  }

  private calculateIndexPosition(outerIndexPosition:number, innerIndexPosition:number): number {


    let lastObjectPosition: number = 0;
    let lengthOfCurrentModule = this.surveyModules[outerIndexPosition].length - 1;

    for (let i = 0; i <= outerIndexPosition; i++)
      lastObjectPosition += this.surveyModules[i].length;
    
      lastObjectPosition -= 1;

      let difference: number = lengthOfCurrentModule - innerIndexPosition;

      let correctIndexPosition: number = lastObjectPosition - difference;

    return correctIndexPosition;
  }

  private storeSelectedModule(): void {
    localStorage.setItem('userSelectedModule', this.indexModuleSelected.toString());
  }

  public changeSurveyProgressBackground(i: number, j: number): any {
    let surveyCount = this.surveyModules[i][j]['surveyCount'];
    let statementCount = this.surveyModules[i][j]['statementCount'];

    if (surveyCount == 0) {
      return { 'background-color': '#f4121d', 'color': '#ffffff' };
    }
    else if (surveyCount < statementCount) {
      return { 'background-color': '#eec12e' };
    }
    else {
      return { 'background-color': '#2aab4f' };
    }    
  }


  public addModules(size: number): void {
    
    if (size < 0)
      return;


    let currentAreaId: number = this.takeSurveyDashboard[size]['areaID'];
    // console.log("AREA ID: " + currentAreaId);
    let nextAreaId: number;

    if (size != 0)
      nextAreaId = Number(this.takeSurveyDashboard[size - 1]['areaID']);
    
    let currentObject: any = this.takeSurveyDashboard[size];

    if (currentAreaId == 0 || currentAreaId == nextAreaId) {
      this.sectionModules.unshift(currentObject);
    } else {
      this.sectionModules.unshift(currentObject);
      this.surveyModules.unshift(this.sectionModules);
      this.sectionModules = [];
    }
    return this.addModules(size - 1);
  }

  public innerLoop(): boolean {
    return this.innerLoopIndex != 0 ? true : false; 
  }
}

@Component({
  selector: 'app-takesurvey',
  templateUrl: './userProfiling.component.html',
  styleUrls: ['./userProfiling.component.css']
})
export class UserProfilingModal { 

  public userMadeChangesFlag;
  public userProfilingForm: FormGroup;
  public httpRequestFlag: boolean;

  constructor(public router: Router, 
              private formBuilder: FormBuilder, 
              public kumulosService: KumulosService, 
              public dialog: MatDialog) 
  {
    this.initUserProfilingForm();
    this.setUserProfilingFormListener();
      
  }

  public initUserProfilingForm(): void 
  {
    this.userProfilingForm = this.formBuilder.group({
      programStatusAnswer: [""],
      personallyEngagedAnswer: [""],
      dimensionAnswer: [""],
      businessFunctionAnswer: [""],
      roleAnswer: [""],
      productLineAnswer: [""],
    })
  }

  private setUserProfilingFormListener()
  {
    this.userProfilingForm.valueChanges.subscribe(data => {
      let form = this.userProfilingForm.value;

      if (form.programStatusAnswer.length > 1 &&
          form.personallyEngagedAnswer.length > 1 &&
          form.dimensionAnswer.length > 1 && 
          form.businessFunctionAnswer.length > 1 &&
          form.roleAnswer.length > 1) {
        this.userMadeChangesFlag = true;
      }
   });
  }

  public submitUserSurvey(): void {
    let version = localStorage.getItem("activeCityVersion");
    this.httpRequestFlag = true;

    
    this.kumulosService.createUpdateUserProfiling(version, this.userProfilingForm).subscribe(result => {

      localStorage.setItem("user_profiling", "1");
      this.httpRequestFlag = false;
      this.dialog.closeAll();
    })
  }

  public enableSubmitButton(): boolean 
  {

    let submitButtonState: boolean = true;

    if (this.userMadeChangesFlag && this.userProfilingForm.valid)
      submitButtonState = false;

    return submitButtonState;
  }

  onSubmit() {}
}

