import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MdSnackBar } from '@angular/material';

import { MdDialog, MdTooltip } from '@angular/material';

import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';

@Component({
  selector: 'adjustAggregatesComponent',
  templateUrl: './adjustAggregates.component.html',
  styleUrls: ['./adjustAggregates.component.css']
})
export class AdjustAggregatesComponent implements OnInit
{ 
  public comboCharts: Array<any>;
  public graphData: Array<any>;
  public graphTitles: Map<number, string>;

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


  constructor(public router: Router, public kumulosService: KumulosService, public snackBar: MdSnackBar, 
              public loadingSnackBar: LoadingSnackBar, public authService: AuthService, public dialog: MdDialog) { 
    this.initializeVariables();
  }

  public initializeVariables(): void {
    this.comboCharts = new Array();
    this.graphData = new Array();
    this.backToDashboardTooltip = "Back To Dashboard";

    this.importanceValues = new Array();
    this.capabilityValues = new Array();
    this.twoYearTargetValues = new Array();
    this.adjustmentDataArray = new Array();
    this.aggregateAdjustmentArray = new Array();
    this.resetImportanceValMapToIndex = new Map<string, string>();
    this.resetScoreValMapToIndex = new Map<string, string>();
    this.resetTargetValMapToIndex = new  Map<string, string>();
  }

  public ngOnInit() {

    // this.getUnadjustedData();

    // this.getAdjustmentVersion();
  }

   private getUnadjustedData(): void 
   {
    this.unAdjustedData = JSON.parse(localStorage.getItem('unadjustedData'));
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
          this.adjustmentDataArray = this.aggregateAdjustmentArray;
        }

        this.updateSurveyValues();
      });
  }

  public routeToPage(surveyPage: String) 
  {
    switch(surveyPage) {
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
      }
    }

    public backToDashboard(): void 
    {
      this.router.navigateByUrl('/main/takesurvey');
    }

   public inAdjustAggregates() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/viewresults/adjustaggregates") {
            return { 'background-color': '#469ac0',
                  'color': 'white' };    
        } else {
        return { 'background-color': '#62B3D1',
                  'color': 'white' };
        }
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

  private updateSurveyValues(): void {

      let mapDimenIdOfAdjustmentVal = this.getMapOfDimenIDToAdjustmentValues();
      
      let unAdjustedDataLength = this.unAdjustedData.length;

      for (let i = 0; i < unAdjustedDataLength; i++) {

        let currentDimension = this.unAdjustedData[i]['dimensionID'];

        if (mapDimenIdOfAdjustmentVal.has(currentDimension)) {
          let adjustmentVal = mapDimenIdOfAdjustmentVal.get(currentDimension);
          
          console.log("Receiving adjustment Val: ");
          console.log(adjustmentVal);

          if (adjustmentVal['importance'] != "9") {
            this.importanceValues[i] = adjustmentVal['importance'];
            this.mapImportanceUnadjustedValToIndexPos(i, this.unAdjustedData[i]['importance']);
            
            let index: String = String(i);
            console.log("Mapped val: " + this.resetImportanceValMapToIndex.get(index));
            
          } else {
            if (this.unAdjustedData[i]['importance'] == " " || this.unAdjustedData[i]['importance'] == "0") {
              this.importanceValues[i] = " ";
            } else {
              this.importanceValues[i] = this.unAdjustedData[i]['importance'];
            }
          }

          if (adjustmentVal['score'] != "9") {
            this.capabilityValues[i] = adjustmentVal['score'];
            console.log("Needle in a haystack: " + this.unAdjustedData[i]['score']);
            this.mapScoreUnadjustedValToIndexPos(i, this.unAdjustedData[i]['score']);
          } else {
            if (this.unAdjustedData[i]['score'] == " " || this.unAdjustedData[i]['score'] == "0") {
              this.capabilityValues[i] = " ";
            } else {
              this.capabilityValues[i] = this.unAdjustedData[i]['score'];
            }
          }

          if (adjustmentVal['target'] != "9") {
            this.twoYearTargetValues[i] = adjustmentVal['target'];
            this.mapTargetUnadjustedValToIndexPos(i, this.unAdjustedData[i]['target']);
          } else {
            if (this.unAdjustedData[i]['target'] == " " || this.unAdjustedData[i]['target'] == "0") {
              this.capabilityValues[i] = " ";
            } else {
              this.twoYearTargetValues[i] = this.unAdjustedData[i]['target'];
            }
          }

        } else {
          if (this.unAdjustedData[i]['importance'] == " " || this.unAdjustedData[i]['importance'] == "0") {
            this.importanceValues[i] = " ";
          } else {
            this.importanceValues[i] = this.unAdjustedData[i]['importance'];
          }

          if (this.unAdjustedData[i]['score'] == " " || this.unAdjustedData[i]['score'] == "0") {
            this.capabilityValues[i] = " ";
          } else {
            this.capabilityValues[i] = this.unAdjustedData[i]['score'];
          }

          if (this.unAdjustedData[i]['target'] == " " || this.unAdjustedData[i]['target'] == "0") {
            this.capabilityValues[i] = " ";
          } else {
            this.twoYearTargetValues[i] = this.unAdjustedData[i]['target'];
          }
        }
      }
    }

    private getMapOfDimenIDToAdjustmentValues() {
      let map = new Map<string, object>();

      for (let i  = 0; i < this.aggregateAdjustmentArray.length; i++) {
        map.set(this.aggregateAdjustmentArray[i]['dimensionID'], this.aggregateAdjustmentArray[i]);
      }

      return map;
    }

    private mapImportanceUnadjustedValToIndexPos(index, unadjustedVal) {
      this.resetImportanceValMapToIndex.set(index, unadjustedVal);
    }

    private mapScoreUnadjustedValToIndexPos(index, unadjustedVal) {
      this.resetScoreValMapToIndex.set(index, unadjustedVal);
    }

    private mapTargetUnadjustedValToIndexPos(index, unadjustedVal) {
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

    let adjustmentKV = this.createAdjustmentDataKV(areaID, dimensionID, importance, score, target, version, updatedBy, aggregateAdjustmentID);
    this.adjustmentDataArray.push(adjustmentKV);
  }

  private updateExistingAdjustKV(dimensionID, index) {
    let indexPosInAdjustmentDataArray = this.getIndexPositionInAdjustmentData(dimensionID);

    let importance;
    let score;
    let target;

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

    this.adjustmentDataArray[indexPosInAdjustmentDataArray]['importance'] = importance;
    this.adjustmentDataArray[indexPosInAdjustmentDataArray]['score'] = score;
    this.adjustmentDataArray[indexPosInAdjustmentDataArray]['target'] = target;
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

      this.httpRequestFlag = true;
      this.kumulosService.createUpdateAdjustmentData(adjustmentData)
        .subscribe(responseJSON => {
          console.log(responseJSON.payload);

          this.dialog.closeAll();
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


}
