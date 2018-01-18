import { Component, Inject, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material';

import { MatDialog, MatTooltip } from '@angular/material';

import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';

import { SavingSnackBar } from '../../../shared/components/savingSnackBar';

@Component({
  selector: 'adjustAggregatesComponent',
  templateUrl: './adjustAggregates.component.html',
  styleUrls: ['./adjustAggregates.component.css']
})
export class AdjustAggregatesComponent implements OnInit, AfterViewInit, AfterViewChecked
{ 

  backToDashboardTooltip: String;

  importanceValues: Array<any>;
  capabilityValues: Array<any>;
  twoYearTargetValues: Array<any>;

  nullAggregateAdjustmentID: string;
  adjustmentDataArray: Array<any>;
  aggregateAdjustmentArray: Array<any>;

  httpRequestFlag: boolean;

  unAdjustedData: Array<any>;

  resetImportanceValMapToIndex: Map<String, string>;
  resetScoreValMapToIndex: Map<string, string>;
  resetTargetValMapToIndex: Map<string, string>;

  pageLoaded: boolean;

  constructor(public router: Router, public kumulosService: KumulosService, public snackBar: MatSnackBar, 
              public savingSnackBar: SavingSnackBar, public loadingSnackBar: LoadingSnackBar, public authService: AuthService, public dialog: MatDialog) 
  { 
    this.loadingSnackBar.showLoadingSnackBar(); 
  }

  public initializeVariables(): void 
  {
    this.backToDashboardTooltip = "Back To Dashboard";

    this.importanceValues = new Array();
    this.capabilityValues = new Array();
    this.twoYearTargetValues = new Array();

    this.adjustmentDataArray = new Array();

    this.aggregateAdjustmentArray = new Array();

    this.resetImportanceValMapToIndex = new Map<string, string>();
    this.resetScoreValMapToIndex = new Map<string, string>();
    this.resetTargetValMapToIndex = new  Map<string, string>();

    this.pageLoaded = false;
  }

  public ngOnInit() 
  {
    this.initializeVariables();
  }

  public ngAfterViewInit()
  {
    if (this.isUnadjustedData()) {
      this.getUnadjustedData();
      this.getAdjustmentVersion();
    } else {
      this.getUnadjustedFromKumulos();
    }
  }

  public ngAfterViewChecked()
  {
     this.pageLoaded = true;
  }

  public isPageLoaded()
  {
    return this.pageLoaded;
  }

  private isUnadjustedData(): boolean
  {
    return localStorage.getItem('unadjustedData') ? true : false;
  }

  private getUnadjustedData(): void 
  {
    this.unAdjustedData = JSON.parse(localStorage.getItem('unadjustedData'));
  }

  private getUnadjustedFromKumulos(): any 
  { 
    //CURRENT ACTIVE CITY
    // let activeCityVersion: string = localStorage.getItem('activeCityVersion');

    //BENCHMARK CITY DATA
    let activeCityVersion: string = localStorage.getItem('benchmarkId');

    let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));
    
    this.kumulosService.getAggregatesForOrganizationResults(activeCityVersion)
        .subscribe(responseJSON => 
        {
          this.cacheUnadjustedGraphData(responseJSON.payload);
          this.unAdjustedData = responseJSON.payload;
          this.getAdjustmentVersion();

        });
  }

  private cacheUnadjustedGraphData(response) 
  {
    localStorage.setItem('unadjustedData', JSON.stringify(response));
  }

  private getAdjustmentVersion(): void 
  {
    let activeVersion = localStorage.getItem('activeCityVersion');

    this.kumulosService.getAdjustmentsByVersion(activeVersion)
      .subscribe(response => {

        if (!response.payload) {
          this.nullAggregateAdjustmentID = "";
        } else {
          this.aggregateAdjustmentArray = response.payload;
          localStorage.setItem('adjusteddata', response.payload);
          this.adjustmentDataArray = this.aggregateAdjustmentArray;
        }
        this.updateSurveyValues();
      });
  }












  










  private updateSurveyValues(): void 
  {
      let mapDimenIdOfAdjustmentVal = this.getMapOfDimenIDToAdjustmentValues();
      
      let unAdjustedDataLength = this.unAdjustedData.length;

      for (let i = 0; i < unAdjustedDataLength; i++) {

        let currentDimension = this.unAdjustedData[i]['dimensionID'];

        if (mapDimenIdOfAdjustmentVal.has(currentDimension)) {
          let adjustmentVal = mapDimenIdOfAdjustmentVal.get(currentDimension);

          if (adjustmentVal['importance'] != "9") {
            this.importanceValues[i] = Number(adjustmentVal['importance']);
            this.mapImportanceUnadjustedValToIndexPos(i, this.unAdjustedData[i]['importance']);
            
            let index: String = String(i);
            
          } else {
            if (this.unAdjustedData[i]['importance'] == " " || this.unAdjustedData[i]['importance'] == "0") {
              // this.importanceValues[i] = " ";
            } else {
              this.importanceValues[i] = Number(this.unAdjustedData[i]['importance']);
            }
          }

          if (adjustmentVal['score'] != "9") {
            this.capabilityValues[i] = Number(adjustmentVal['score']);
            this.mapScoreUnadjustedValToIndexPos(i, this.unAdjustedData[i]['score']);
          } else {
            if (this.unAdjustedData[i]['score'] == " " || this.unAdjustedData[i]['score'] == "0") {
              // this.capabilityValues[i] = " ";
            } else {
              this.capabilityValues[i] = Number(this.unAdjustedData[i]['score']);
            }
          }

          if (adjustmentVal['target'] != "9") {
            this.twoYearTargetValues[i] = Number(adjustmentVal['target']);
            this.mapTargetUnadjustedValToIndexPos(i, this.unAdjustedData[i]['target']);
          } else {
            if (this.unAdjustedData[i]['target'] == " " || this.unAdjustedData[i]['target'] == "0") {
              // this.capabilityValues[i] = " ";
            } else {
              this.twoYearTargetValues[i] = Number(this.unAdjustedData[i]['target']);
            }
          }

        } else {
          if (this.unAdjustedData[i]['importance'] == " " || this.unAdjustedData[i]['importance'] == "0") {
            // this.importanceValues[i] = " ";
          } else {
            this.importanceValues[i] = Number(this.unAdjustedData[i]['importance']);
          }

          if (this.unAdjustedData[i]['score'] == " " || this.unAdjustedData[i]['score'] == "0") {
            // this.capabilityValues[i] = " ";
          } else {
            this.capabilityValues[i] = Number(this.unAdjustedData[i]['score']);
          }

          if (this.unAdjustedData[i]['target'] == " " || this.unAdjustedData[i]['target'] == "0") {
            // this.capabilityValues[i] = " ";
          } else {
            this.twoYearTargetValues[i] = Number(this.unAdjustedData[i]['target']);
          }
        }
      }
      this.loadingSnackBar.dismissLoadingSnackBar();
    }

    private getMapOfDimenIDToAdjustmentValues() {
      let map = new Map<string, object>();

      for (let i  = 0; i < this.aggregateAdjustmentArray.length; i++)
        map.set(this.aggregateAdjustmentArray[i]['dimensionID'], this.aggregateAdjustmentArray[i]);

      return map;
    }

    private mapImportanceUnadjustedValToIndexPos(index, unadjustedVal) 
    {
      this.resetImportanceValMapToIndex.set(index, unadjustedVal);
    }

    private mapScoreUnadjustedValToIndexPos(index, unadjustedVal) 
    {
      this.resetScoreValMapToIndex.set(index, unadjustedVal);
    }

    private mapTargetUnadjustedValToIndexPos(index, unadjustedVal) 
    {
      this.resetTargetValMapToIndex.set(index, unadjustedVal);
    }




  public importanceSliderChanged(index, event) {
    this.importanceValues[index] = event.args.value;
  }

  public importanceSliderClicked(index) {

      if (this.unAdjustedData[index]['importance'] == null) {
        this.mapImportanceUnadjustedValToIndexPos(index, "0");  
      } else {
        this.mapImportanceUnadjustedValToIndexPos(index, this.unAdjustedData[index]['importance']);
      }
      
      this.sliderChanged(index);
  }

  public scoreSliderChanged(index, event) {
    this.capabilityValues[index] = event.args.value;
  }

  public scoreSliderClicked(index, event) {
     if (this.unAdjustedData[index]['score'] == null) {
      this.mapScoreUnadjustedValToIndexPos(index, "0");
    } else {
      this.mapScoreUnadjustedValToIndexPos(index, this.unAdjustedData[index]['score']);
    }
    this.sliderChanged(index);
  }

  public targetSliderChanged(index, event) {
    this.twoYearTargetValues[index] = event.args.value;
  }

  public targetSliderClicked(index) {
    if (this.unAdjustedData[index]['target'] == null) {
      this.mapTargetUnadjustedValToIndexPos(index, "0");
    } else {
      this.mapTargetUnadjustedValToIndexPos(index, this.unAdjustedData[index]['target']);
    }

    this.sliderChanged(index);
  }

  public sliderChanged(index: any) {
    let dimensionID = this.unAdjustedData[index]['dimensionID'];      

        if (!this.isDimensionIDInAdjustmentDataArray(dimensionID)) {
          this.buildAggregateAdjustmentKV(index);
        } else {
          this.updateExistingAdjustKV(dimensionID, index);
        }
  }

  private isDimensionIDInAdjustmentDataArray(dimensionID): boolean {
    for (let i = 0; i < this.adjustmentDataArray.length; i++) {
      if (this.adjustmentDataArray[i]['dimensionID'] == dimensionID) {
        return true;
      }
    }

    return false;
  }

  private buildAggregateAdjustmentKV(index): any {
    let dimensionID = this.unAdjustedData[index]['dimensionID'];
    let areaID = this.unAdjustedData[index]['areaID'];  

    let importance;
    let score;
    let target;

    if (this.importanceValues[index] == this.unAdjustedData[index]['importance']) {
      importance = "9";
    } else {
      importance = this.importanceValues[index];
    }
    
    if (this.capabilityValues[index] == this.unAdjustedData[index]['score']) {
      score = "9";
    } else {
      score = this.capabilityValues[index];
    }
    
    if (this.twoYearTargetValues[index] == this.unAdjustedData[index]['target']) {
      target = "9";
    } else {
      target = this.twoYearTargetValues[index];
    }
    
    let version = localStorage.getItem('activeCityVersion');

    let user = JSON.parse(localStorage.getItem('userProfile'));
    let updatedBy = user['user_id'];

    let aggregateAdjustmentID: String = this.getAggregateAdjustmentID(dimensionID);

    if (this.importanceValues[index] != 0 && this.capabilityValues[index] != 0 && this.twoYearTargetValues[index] != 0)
    {
      console.log("CREATING ADJUSTMENT");
      let adjustmentKV = this.createAdjustmentDataKV(areaID, dimensionID, importance, score, target, version, updatedBy, aggregateAdjustmentID);
      this.adjustmentDataArray.push(adjustmentKV);
    } else {
      console.log("NOT CREATING ADJUSTMENT");
    }
  }

  private updateExistingAdjustKV(dimensionID, index) {

    console.log("slider adjusted on existing data");
    let indexPosInAdjustmentDataArray = this.getIndexPositionInAdjustmentData(dimensionID);

    let importance;
    let score;
    let target;


    //CURRENTLY ALLOWS RESET TO 0
    if (this.importanceValues[index] == "0" || this.importanceValues[index] == this.unAdjustedData[index]['importance']) {
      importance = "9";
    } else {
      importance = this.importanceValues[index];
    }
    
    if (this.capabilityValues[index] == "0" || this.capabilityValues[index] == this.unAdjustedData[index]['score']) {
      score = "9";
    } else {
      score = this.capabilityValues[index];
    }
    
    if (this.twoYearTargetValues[index] == "0" || this.twoYearTargetValues[index] == this.unAdjustedData[index]['target']) {
      target = "9";
    } else {
      target = this.twoYearTargetValues[index];
    }


    //NEED TO ASK JAMES - IF USER RESETS TO 0 THEY ARE UNABLE TO
    if (this.importanceValues[index] != "0" && this.capabilityValues[index] != "0" && this.twoYearTargetValues[index] != "0")
    {
      console.log("Updating existing data");
      this.adjustmentDataArray[indexPosInAdjustmentDataArray]['importance'] = this.importanceValues[index];
      this.adjustmentDataArray[indexPosInAdjustmentDataArray]['score'] = this.capabilityValues[index];
      this.adjustmentDataArray[indexPosInAdjustmentDataArray]['target'] = this.twoYearTargetValues[index];
    } else {
      console.log("NOT Updating existing data");
    }
  }

  private getAggregateAdjustmentID(dimensionID): any {
    let aggregateAdjustmentID: string;

    if(this.inAggregatedAdjustmentArray(dimensionID)) {
      let indexPos = this.getIndexPosInAggregateAdjustmentArray(dimensionID);
      aggregateAdjustmentID = this.aggregateAdjustmentArray[indexPos]['aggregateAdjustmentID'];
    } else {
      aggregateAdjustmentID = "";
    } 
    
    return aggregateAdjustmentID;
  }

  private inAggregatedAdjustmentArray(dimensionID): boolean {
    for (let i = 0; i < this.aggregateAdjustmentArray.length; i++) {
      if (this.aggregateAdjustmentArray[i].dimensionID == dimensionID) {
        return true;
      }
    }

    return false;
  }

  private getIndexPosInAggregateAdjustmentArray(dimensionID): any {
    for (let i = 0; i < this.aggregateAdjustmentArray.length; i++) {
      if (this.aggregateAdjustmentArray[i].dimensionID == dimensionID) {
        return i;
      }
    }
  }

  private getIndexPositionInAdjustmentData(dimensionID) {
    for (let i = 0; i < this.adjustmentDataArray.length; i++) {

      if (this.adjustmentDataArray[i]['dimensionID'] == dimensionID) {
        return i;
      }

    }
  }

  private createAdjustmentDataKV(areaID, dimensionID, importance, score, target, version, updatedBy, aggregateAdjustmentID): any {
    
    let adjustmentKV = {
      "areaID": areaID,
      "dimensionID": dimensionID,
      "importance": importance,
      "score": score,
      "target": target,
      "version": version,
      "updatedBy": updatedBy,
      "aggregateAdjustmentID": aggregateAdjustmentID
    };

    return adjustmentKV;
  }

  


   public sendSurveyRequest(): void {
      let adjustmentData: string = this.getAdjustmentData();
      this.savingSnackBar.showSavingSnackBar();
      this.httpRequestFlag = true;
      this.kumulosService.createUpdateAdjustmentData(adjustmentData)
        .subscribe(responseJSON => {
          console.log(responseJSON.payload);

          this.savingSnackBar.showSavedSnackBar();
          // this.savingSnackBar.dismissSavingSnackBar();
          // this.dialog.closeAll();
        });
  }

  private adjustmentDataHasAllReset(): boolean {
    for (let i = 0; i < this.adjustmentDataArray.length; i++) {

      let importance = this.adjustmentDataArray[i]['importance'];
      let score = this.adjustmentDataArray[i]['score'];
      let target = this.adjustmentDataArray[i]['target'];

      if(importance == "9" && score == "9" && target == "9") {
        return true;
      }
      
    }

    return false;
  }

  private removeAdjustmentData() {
    for (let i = 0; i < this.adjustmentDataArray.length; i++) {

      let importance = this.adjustmentDataArray[i]['importance'];
      let score = this.adjustmentDataArray[i]['score'];
      let target = this.adjustmentDataArray[i]['target'];

      if(importance == "9" && score == "9" && target == "9") {
        this.kumulosService.deleteSingleAdjustmentWithJWT(this.adjustmentDataArray[i]['aggregateAdjustmentID'])
          .subscribe(response => {
            this.adjustmentDataArray.splice(i, 1);
          });
        
      }
    }
  }

  private getAdjustmentData(): string {
    let adjustmentData = {"adjustmentData": this.adjustmentDataArray};

    return JSON.stringify(adjustmentData);
  }

  public getImportanceResetVal(index) {
    return this.resetImportanceValMapToIndex.get(index);
  }

  public getScoreResetVal(index) {
    return this.resetScoreValMapToIndex.get(index);
  }

  public getTargetResetVal(index) {
    return this.resetTargetValMapToIndex.get(index);
  }

  public resetImportanceValHasIndex(index): boolean {
    return (this.resetImportanceValMapToIndex.get(index)) ? true : false;
  }

  public resetScoreValHasIndex(index): boolean {
    return (this.resetScoreValMapToIndex.get(index)) ? true : false;
  }

  public resetTargetValHasIndex(index): boolean {
    return (this.resetTargetValMapToIndex.get(index)) ? true : false;
  }


  public setImportanceValToDefault(index) {
    
    this.importanceValues[index] = this.getImportanceResetVal(index);
  
    this.removeImportanceValMap(index);
    this.sliderChanged(index);
  }

  private removeImportanceValMap(index) {
    this.resetImportanceValMapToIndex.delete(index);
  }

  public setScoreValToDefault(index) {
    this.capabilityValues[index] = this.getScoreResetVal(index);
    this.removeScoreValMap(index);
    this.sliderChanged(index);
  }

  private removeScoreValMap(index) {
    this.resetScoreValMapToIndex.delete(index);
  }

  public setTargetValToDefault(index) {
    this.twoYearTargetValues[index] = this.getTargetResetVal(index);
    this.removeTargetValMap(index);
    this.sliderChanged(index);
  }

  private removeTargetValMap(index) {
    this.resetTargetValMapToIndex.delete(index);
  }






















  public showResultsTab() 
  {
    let loggedIn: boolean = this.authService.isAuthenticated();
    let isLeaderOrConsultant: boolean = this.authService.isLeaderConsultant();

    if (!loggedIn) {
      return true;
    } else {
      if (isLeaderOrConsultant) {
        return true;
      }
    }

    return false;
  }   

  public routeToPage(surveyPage: String) 
  {
    switch(surveyPage) 
    {
      case('myownresults'):
        this.router.navigateByUrl('main/viewresults/myownresults');
        break;
      case ('organizationresults'):
        this.router.navigateByUrl('main/viewresults/organizationresults');
        break;
      case ('teamdynamics'):
        this.router.navigateByUrl('main/viewresults/teamdynamics');
        break;
      case ('adjustaggregates'):
        this.router.navigateByUrl('main/viewresults/adjustaggregates');
        break;
      case ('heatmap'):
        this.router.navigateByUrl('main/viewresults/heatmap');
        break;
      }
    }

    public backToDashboard(): void 
    {
      this.router.navigateByUrl('/main/takesurvey');
    }

   public inAdjustAggregates() 
   {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/viewresults/adjustaggregates") {
            return { 'background-color': '#469ac0',
                  'color': 'white' };    
        } else {
        return { 'background-color': '#62B3D1',
                  'color': 'white' };
        }
    }
}
