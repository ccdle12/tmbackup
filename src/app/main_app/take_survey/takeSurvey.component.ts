import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
import { MdSnackBar, MdProgressBar } from '@angular/material';
import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';
import { AuthService } from '../../shared/services/auth.service';

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

  constructor(public router: Router, public authService: AuthService, public loadingSnackBar: LoadingSnackBar, public kumulosService: KumulosService) {
    
    this.surveyModules = new Array();
    this.sectionModules = new Array();

    let activeCityVersion: string = localStorage.getItem('activeCityVersion');
    console.log("Active Version From Localstorage before call?")
    console.log(activeCityVersion);

     this.inDemoOrInMainApp();

    this.loadingSnackBar.showLoadingSnackBar();
    this.getActiveVersionForCity();
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
            console.log("Active version using response json: " + responseJSON.payload);

            this.getWebDashboard(activeCityVersion);
        });
    }

  private getWebDashboard(activeCityVersion: string): void {
    this.kumulosService.getWebDashboard(activeCityVersion)
      .subscribe(responseJSON => { 
        console.log(responseJSON);
        localStorage.setItem('surveydashboard', JSON.stringify(responseJSON.payload));

        // this.takeSurveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));
        this.takeSurveyDashboard = responseJSON.payload;
        console.log("From Local Storage - Survey Dashboard:")
        console.log(responseJSON.payload);

        if (responseJSON.payload) {
          this.removeTotalFromDashboard();
          this.calculateProgressValue();
          this.addModules(this.takeSurveyDashboard.length - 1);
          console.log("API callback: " + (this.takeSurveyDashboard.length - 1));
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

    console.log("statment count: " + statementCount);
    console.log("survey count: " + surveyCount);

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

    console.log("selected module: " + this.indexModuleSelected);
 
    this.storeSelectedModule();

    this.router.navigateByUrl('/main/takesurvey/surveymodule/survey');
  }

  private calculateIndexPosition(outerIndexPosition:number, innerIndexPosition:number): number {
    console.log("Outer index position: " + outerIndexPosition);
    console.log("Inner index position: " + innerIndexPosition);

    let lastObjectPosition: number = 0;
    let lengthOfCurrentModule = this.surveyModules[outerIndexPosition].length - 1;

    // console.log("LENGTH OF MODULE: " + lengthOfCurrentModule);

    for (let i = 0; i <= outerIndexPosition; i++)
      lastObjectPosition += this.surveyModules[i].length;
    
    console.log("LAST OB POS: " + lastObjectPosition);

    // return lastObjectPosition;
      lastObjectPosition -= 1;
      console.log("last object pos: " + lastObjectPosition);
      console.log("innerIndexPos: " + innerIndexPosition);

      console.log("CURRENT MODULE LEN: " + lengthOfCurrentModule);
      let difference: number = lengthOfCurrentModule - innerIndexPosition;

      console.log("difference: " + difference);
      let correctIndexPosition: number = lastObjectPosition - difference;

    return correctIndexPosition;







      // let lengthOfModules: number[] = [];

      // for (let i = 1; i < this.surveyModules.length; i++)
      //   lengthOfModules[i] = this.surveyModules[i].length;

      // console.log("Len of modules: " + lengthOfModules[2]);

      // let totalArraySizeSoFar = 0;
      // console.log("Outer index pos: " + outerIndexPosition);

      // if (outerIndexPosition == 0)
      //   totalArraySizeSoFar = lengthOfModules[0];
      // else {
      //   for (let j = 0; j < outerIndexPosition; j++)
      //   {
      //     console.log("Len of mod: " + lengthOfModules[j]);
      //     totalArraySizeSoFar += lengthOfModules[j];
      //   }
      // }

      // console.log("Total arr size: " + totalArraySizeSoFar);
      
      // // let result = Number(totalArraySizeSoFar - (lengthOfModules[outerIndexPosition] - innerIndexPosition + 1));

      // let result = totalArraySizeSoFar;
      // console.log("USER SELECTED RESULT: " + result);
      // return result;
  }

  private storeSelectedModule(): void {
    localStorage.setItem('userSelectedModule', this.indexModuleSelected.toString());
  }

  public changeSurveyProgressBackground(i: number, j: number): any {
    let surveyCount = this.surveyModules[i][j]['surveyCount'];
    let statementCount = this.surveyModules[i][j]['statementCount'];

    if (surveyCount == 0) {
      return { 'background-color': '#7abed8' };
    }
    else if (surveyCount < statementCount) {
      return { 'background-color': '#f1be5e' };
    }
    else {
      return { 'background-color': '#9aca71' };
    }    
  }


  public addModules(size: number): void {
    
    if (size < 0)
      return;


    let currentAreaId: number = this.takeSurveyDashboard[size]['areaID'];
    console.log("AREA ID: " + currentAreaId);
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


