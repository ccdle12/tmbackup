import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material';

import { MatDialog, MatTooltip } from '@angular/material';

import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';
import { MatCard } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { StylingService } from '../../../shared/services/styling.service';


@Component({
  selector: 'app-heatmap',
  templateUrl: './heatMap.component.html',
  styleUrls: ['./heatMap.component.css']
})
export class HeatMapComponent {

  /**
   * Using code fomr take survey
   */
  public surveyDashboard: Array<JSON>;
  public heatMapJSON: Array<JSON>;
  public surveyModules: Array<any>;
  public sectionModules: Array<any>; // no values in this array?
  public sortedSurveyAndHeatMap: Array<any>;
  public clickFlagOnArea: Map<any, boolean>;
  public arrOfClickOnFlagArea: Array<any>;
  public heatMapUnpacked: boolean;

  public backToDashboardTooltip: string;

  public currentHoverText: string;



  constructor(public router: Router, 
              public kumulosService: KumulosService, 
              public snackBar: MatSnackBar, 
              public loadingSnackBar: LoadingSnackBar, 
              public authService: AuthService, 
              public dialog: MatDialog,
              public stylingService: StylingService) {

      this.loadingSnackBar.showLoadingSnackBar();

      this.initInstanceVariables();

      this.getWebDashboard();
  }

  private initInstanceVariables() {
    this.surveyDashboard = new Array();
    this.heatMapJSON = new Array();
    this.surveyModules = new Array();
    this.sectionModules = new Array();
    this.sortedSurveyAndHeatMap = new Array();
    this.heatMapUnpacked = false;
    this.arrOfClickOnFlagArea = new Array();

    this.backToDashboardTooltip = "Back to Dashboard";

    this.currentHoverText = "dummy text";
  }

  public navStyle() 
  {
      return {'background-color': this.stylingService.getPrimaryColour('grey')}
  }

  /**
   * Functions to unpack the heat map data
   */
  public getWebDashboard() {

    let version = this.getActiveVersion();
    // (version);

    this.kumulosService.getWebDashboard(version).subscribe(response => {

      //Get the web dashboard so we can reuse the code from take surveys
      this.surveyDashboard = response.payload;

      //Unpack the surveyDashboard to be formatted for the view
      this.addModules(this.surveyDashboard.length - 1);

      // Remove the last module which is TOTAL
      this.surveyModules = this.surveyModules.slice(0, this.surveyModules.length - 1);

      // Get the Heat Map Data
      this.getHeatMapData();
    });
  }

  private getActiveVersion() {
    return localStorage.getItem("activeCityVersion");
  }

  public addModules(size: number): void {
    
    if (size < 0)
      return;

    let currentAreaId: number = this.surveyDashboard[size]['areaID'];
    let nextAreaId: number;

    if (size != 0)
      nextAreaId = Number(this.surveyDashboard[size - 1]['areaID']);
    
    let currentObject: any = this.surveyDashboard[size];

    if (currentAreaId == 0 || currentAreaId == nextAreaId) {
      this.sectionModules.unshift(currentObject);
    } else {
      this.sectionModules.unshift(currentObject);
      this.surveyModules.unshift(this.sectionModules);
      this.sectionModules = [];
    }

    return this.addModules(size - 1);
  }

  public getHeatMapData() {

    let version = this.getActiveVersion();
    this.kumulosService.webGetHeatMap(version).subscribe(response => {

      //Adding the payload to heat map json
      this.heatMapJSON = response.payload;

      // Unpack heat map data into [][] array corresponding to each survey module index position
      this.unpackHeatMap();

       // Map each index position of survey modules to whether user has clicked
       for (let i = 0; i < this.surveyModules.length; i++) {
         let outerArray = new Array();
         for (let j = 0; j < this.surveyModules[i].length; j++) {
          outerArray.push(false);
        }

        this.arrOfClickOnFlagArea.push(outerArray);
      }
    });
  }

  private unpackHeatMap() {

    // An array to hold the heat map data at the position of each survey module
    let outerArraySurveyPosition = new Array();

    // An array corresponding to each module position
    let innerArrayModulePosition = new Array();



    // Iterate through the survey modules
    for (let i = 0; i < this.surveyModules.length; i++) {

      // Iterating through each survey in the module
      for (let k = 0; k < this.surveyModules[i].length; k++) {
        let targetDimensionID = this.surveyModules[i][k].dimensionID

        // Iterate through heat map and find corresponding ids to target
        for (let j = 0; j < this.heatMapJSON.length; j++) {

          let current = this.heatMapJSON[j]["dimensionID"];

          if (current == targetDimensionID) {
            innerArrayModulePosition.push(this.heatMapJSON[j]);
          }
      }

      outerArraySurveyPosition.push(innerArrayModulePosition);
      innerArrayModulePosition = [];
    }

    //Push the outer array to the sorted survey and heatmap
    this.sortedSurveyAndHeatMap.push(outerArraySurveyPosition);
    outerArraySurveyPosition = [];
    }

    this.heatMapUnpacked = true;
    this.loadingSnackBar.dismissLoadingSnackBar();
  }


  /**
   * Functions bound to the view
   *
   */
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
        this.loadingSnackBar.showLoadingSnackBar();
        this.router.navigateByUrl('main/viewresults/adjustaggregates');
        break;

      case ('heatmap'):
        this.router.navigateByUrl('main/viewresults/heatmap');
        break;
      }
  }

  public inHeatMap() {
    let currentUrl: string = window.location.pathname;

    if (currentUrl ===  "/main/viewresults/heatmap") {
        return { 'background-color': this.stylingService.getPrimaryColour('red'),
              'color': 'white' };    
    } else {
    // (window.location.pathname);
    return { 'background-color': '#62B3D1',
              'color': 'white' };
    }
}

public showResultsTab() {
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

public backToDashboard(): void {
  this.router.navigateByUrl('/main/takesurvey');
}

public inChildComponents(): boolean {
  let currentUrl = this.router.url;

  let urlRegex = '(\/takesurvey\/.*)';

  return !currentUrl.match(urlRegex) ? true : false;
}


public getHeatMapItems(i, j) {
  return this.sortedSurveyAndHeatMap[i][j];
}

public colorToScore(i, j, k) {

  let gapScore = Number(this.sortedSurveyAndHeatMap[i][j][k]["gap"]);

  switch(gapScore) {

    // TODO FIND ALL THE COLORS
    case(0):
      // Green
      return { 'background-color': '#88C158', 'color': 'white' };
    
    case(1):
      // Amber
      return { 'background-color': '#FFBF00', 'color': 'white' };

    case(2):
      //Amber / Red
      //Using Amber for now for 2
      return { 'background-color': '#FFBF00', 'color': 'white' };
      // return { 'background-color': '#ff6600', 'color': 'white' };

    case(3):
      // Red
      return { 'background-color': this.stylingService.getHexPrimaryColour('red'), 'color': 'white' };

    case(4):
      // Red
      return { 'background-color': this.stylingService.getHexPrimaryColour('red'), 'color': 'white' };

    case(9):
      // Grey - is the default
      // "rgb(230, 230, 230)"
      // Currently testing - Red
      // return { 'background-color': '#ff0000', 'color': 'white' };
      break;
      
  } 
  }


  public revertToDropDownColor(i, j) {

    if (this.arrOfClickOnFlagArea[i][j])
    {
      return "rgb(230, 230, 230)";
    }
    else {
      let dropDownArray = this.sortedSurveyAndHeatMap[i][j];
      let greenLevelCount = 0;
      let nineCount = 0;
      let amberCount = 0;

      for (let k = 0; k < dropDownArray.length; k++) {
        let gap = Number(dropDownArray[k]["gap"]);
        
        // If anything is grey then the top level is grey
        if (gap == 9) return "rgb(230, 230, 230)"

        // If anything is 3 or 4 then return red straight away
        if (gap == 3 || gap == 4) return "#ff0000";

        // If green increment
        if (gap == 0) greenLevelCount++

        // If amber incremeent
        if (gap == 1 || gap == 2) amberCount++
      }

      if (greenLevelCount > amberCount)
        return "#88C158"
      else
        return "#FFBF00"
    }
  }

  public toggleSurveyModuleColor(i, j) {
    let boolState = this.arrOfClickOnFlagArea[i][j];
    boolState = !boolState;

    this.arrOfClickOnFlagArea[i][j] = boolState;
  }

  public mouseEnter(i, j, k) {
    let highlightedArea: JSON = this.sortedSurveyAndHeatMap[i][j][k];
    let importance = highlightedArea["importance"];
    let score = highlightedArea["score"];
    let target = highlightedArea["target"];
    let gap = highlightedArea["gap"];
    let statementText = highlightedArea["statementText"];

    this.currentHoverText =  "Importance: " + importance + "\n, " + "Score: " + score + "\n, " + "Target: " + target + "\n, " + "Gap: " + gap + "\n, " + "Statement: " + statementText;
  }
}