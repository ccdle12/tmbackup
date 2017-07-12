import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MdSnackBar } from '@angular/material';
import { EmailSentSnackBarComponent } from '../my_own_results/myOwnResults.component';

import { MdDialog } from '@angular/material';


@Component({
  selector: 'teamDynamicsComponent',
  templateUrl: './teamDynamics.component.html',
  styleUrls: ['./teamDynamics.component.css']
})
export class TeamDynamicsComponent { 

  public candleChartsForDisplay: Array<any>;
  public graphData: Array<any>;
  public numberOfGraphs: number;
  public graphTitles: Map<number, string>;
  public areaTexts: Array<string>;

  // public areaTitles: Map<number, string>;
  public areaTitles: Array<string>;

  public selectedGraph: any;
  private sortedDataForEachGraph: Array<any>;

  public areaBanners: Map<number, string>;

  public selectedValue: any;
  
  constructor(public router: Router, public kumulosService: KumulosService, 
              public snackBar: MdSnackBar, public authService: AuthService,
              public dialog: MdDialog) {
    this.initializeMemberVariables();
    this.getTeamDynamicsData();
  }

  private initializeMemberVariables(): void {
    this.candleChartsForDisplay = new Array();
    this.graphData = new Array();

    this.sortedDataForEachGraph = new Array();


    this.graphTitles = new Map<number, string>();

    this.areaTexts = new Array();
    // this.areaTitles = new Map<number, string>();
    this.areaTitles = new Array();

    this.areaBanners = new Map<number, string>();
  }

  private getTeamDynamicsData(): void {
    let activeCityVersion: string = localStorage.getItem('activeCityVersion');

    this.kumulosService.getWhiskerBoxDataByVersion(activeCityVersion)
        .subscribe(responseJSON =>{
          console.log(responseJSON.payload);
          this.graphData = responseJSON.payload;
          this.createCandleCharts();
          
          this.addAreaTextsMap();
          this.addGraphTitles();

          console.log(this.candleChartsForDisplay);
          // this.addAreaTexts();
        })
  }

   public backToDashboard(): void {
    this.authService.backToDashboard();
  }

  public activeBackgroundColor() {
        return { 'background-color': '#62B3D1',
                  'color': 'white' };
    }

  public routeToPage(surveyPage: String) {
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
      }
    }

    private createCandleCharts(): void {
      this.addToCandleChartArray(this.graphData.length - 1);
    }

    private addToCandleChartArray(graphIndexPosition: number): any {
      if (graphIndexPosition < 0)
        return;

      let currentGraphData: JSON = this.graphData[graphIndexPosition];
      let nextGraphData: JSON;

      let currentDimensionID: number = Number(currentGraphData['dimensionID']);
      let nextDimensionID: number;

      if (graphIndexPosition != 0) {
        nextGraphData = this.graphData[graphIndexPosition - 1];
        nextDimensionID = Number(nextGraphData['dimensionID']);
      }

      let statementId: string = currentGraphData['statementID'];
      let boxValueLow: number = Number(currentGraphData['boxValueLow']);
      let boxValueHigh: number = Number(currentGraphData['boxValueHigh']);
      let boxValueQ1: number = Number(currentGraphData['boxValueQ1']);
      let boxValueQ2: number = Number(currentGraphData['boxValueQ2']);
      let statementText: string = currentGraphData['statementText'];

      let toolTip: string = statementId + ": " + statementText;
      

      if (currentDimensionID == 0 || currentDimensionID == nextDimensionID) {
        this.sortedDataForEachGraph.unshift([statementId, boxValueLow, boxValueQ1, boxValueQ2, boxValueHigh, toolTip]);
      } else {
        this.sortedDataForEachGraph.unshift([statementId, boxValueLow, boxValueQ1, boxValueQ2, boxValueHigh, toolTip]);
        this.sortedDataForEachGraph.unshift(['Sections', 'Low', 'Opening value', 'Closing value', 'High', {role: 'tooltip'}]);
    
        this.candleChartsForDisplay.unshift(this.sortedDataForEachGraph);
        this.sortedDataForEachGraph = [];
      }

      return this.addToCandleChartArray(graphIndexPosition - 1);
    }

    private addGraphTitles(): void {
      let graphDataIndexPos: number = 0;
      let chartsDisplayedIndexPos: number = 0;
      
  
      while (graphDataIndexPos < this.graphData.length) {

        //  console.log("Graph Index Pos: " + graphDataIndexPos);
         let eachDisplayedGraphLength: number = this.candleChartsForDisplay[chartsDisplayedIndexPos].length;
         let dimensionTextIndexPos: number;

         if (graphDataIndexPos <= 0) {
          dimensionTextIndexPos = (graphDataIndexPos + eachDisplayedGraphLength) - 2;
        } else {
          dimensionTextIndexPos = graphDataIndexPos + eachDisplayedGraphLength - 1;
        }
        
        if (this.graphData[dimensionTextIndexPos]) {
          let dimensionTextData: string = this.graphData[dimensionTextIndexPos]['dimensionText'];

          // console.log("Dimension Text: " + dimensionTextData + " | Index Pos: " + dimensionTextIndexPos);
          // console.log("Text from graph data array: " + this.graphData[dimensionTextIndexPos]['dimensionText']);
          // console.log("charts displayed index: " + chartsDisplayedIndexPos);

          this.graphTitles.set(chartsDisplayedIndexPos, dimensionTextData);  
        }

        console.log("Last Position: " + this.graphData[175]['dimensionText']);
        chartsDisplayedIndexPos++;
        graphDataIndexPos = dimensionTextIndexPos;
      }
    }

    // private addAreaTextsMap(): void {

    //   let graphDataIndexPos: number = 0;
    //   let chartsDisplayedIndexPos: number = 0;

    //   let tempHashMap = new Map<string, string>();
    //   console.log("Length of charts displayed: " + this.candleChartsForDisplay.length);

    //   tempHashMap.set(this.graphData[0]['areaText'], this.graphData[0]['areaText']);      
    //   this.areaBanners.set(0, this.graphData[0]['areaText']);

    //   while (graphDataIndexPos <= this.graphData.length) {
        
    //     let eachDisplayedGraphLength: number = this.candleChartsForDisplay[chartsDisplayedIndexPos].length;
    //     console.log("Each length: " + eachDisplayedGraphLength);
    //     let dimensionTextIndexPos: number;

    //     dimensionTextIndexPos = (graphDataIndexPos + eachDisplayedGraphLength);
    //     console.log("New Area Text Position: " + dimensionTextIndexPos);

    //     if (!tempHashMap.has(this.graphData[graphDataIndexPos]['areaText'])) {
    //      console.log("Graph Index Pos: " + graphDataIndexPos);
    //      console.log("Display for candle chart: " + (graphDataIndexPos - eachDisplayedGraphLength));
    //      tempHashMap.set(this.graphData[dimensionTextIndexPos]['areaText'], this.graphData[dimensionTextIndexPos]['areaText']);
    //      this.areaBanners.set((graphDataIndexPos - eachDisplayedGraphLength), this.graphData[dimensionTextIndexPos]['areaText']);  
    //      console.log("Area Text: " + this.graphData[dimensionTextIndexPos]['areaText']);
    //   }
        
    //     chartsDisplayedIndexPos++;
    //     graphDataIndexPos = dimensionTextIndexPos;
    //   }

    //   console.log("Test: Should be: 'Customer': " + this.areaBanners.get(0));
    //   console.log("Test: Should be: 'Strategy': " + this.areaBanners.get(29));
    //   console.log("Test: Should be: 'Culture': " + this.areaBanners.get(164));
    // }

    private addAreaTextsMap() {
      let tempMap = new Map<string, string>();
      let key: number = 0;

      tempMap.set(this.graphData[0]['areaText'], this.graphData[0]['areaText']);

      this.areaBanners.set(key, this.graphData[0]['areaText']);
      console.log("TEST: Should Be: 'Customer': " + this.areaBanners.get(0));
      
      for (let i = 1; i < this.graphData.length; i++) {
        let areaText: string = this.graphData[i]['areaText'];
        let prevAreaText: string = this.graphData[i-1]['areaText'];

        let dimensionText: string = this.graphData[i]['dimensionText'];
        let prevDimensionText: string = this.graphData[i-1]['dimensionText'];

        if (!tempMap.has(areaText)) {
          tempMap.set(areaText, areaText);
          this.areaBanners.set(key+1, areaText);
          key++;
        } else {
          if (prevAreaText == areaText) {
            if (prevDimensionText != dimensionText) {
              key++;
          }
        }
        }
      }

      console.log("TEST: Should Be: 'Strategy': " + this.areaBanners.get(1));
      console.log("TEST: Should Be: 'Technology': " + this.areaBanners.get(2));
      console.log("TEST: Should Be: 'Operations': " + this.areaBanners.get(3));
      console.log("TEST: Should Be: 'Culture': " + this.areaBanners.get(4));
    }

    private getAreaTexts(index: number) {
      if (this.areaBanners.has(index)) {
        return this.areaBanners.get(index);
      }
    }

    // private addAreaTexts(): void {

    //   let areaTextTitles: Map<string, string> = new Map<string, string>();

    //   for (var i = 0; i < this.graphData.length; i++) {
    //     let eachGraph: JSON = this.graphData[i];
    //     let areaText: string = eachGraph['areaText'];

    //     if(!areaTextTitles.has(areaText)) {
    //       areaTextTitles.set(areaText, areaText);
    //       this.areaTexts.push(areaText);
    //     }
    //   }
    // }

    public filterGraphs(indexPos: number) {
      this.selectedGraph = this.areaTitles[indexPos];
    }

    public showGraphs(indexPos: number) {
      if (this.selectedGraph == this.areaTitles[indexPos]) {
        return true;
      }

      return false;
    }

    public getAreaTextTitles(indexPos: number) : any {
      return this.areaTexts[indexPos];
    }

    public getGraphTitles(indexPos: number): any {
      return this.graphTitles.get(indexPos);
    }

    public candle_ChartOptions = {
        legend: 'none',
        bar: { groupWidth: '25%' }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#A9A9A9' }, // red
            risingColor: { strokeWidth: 0, fill: '#A9A9A9' }   // green
        },
        tooltip: {
          trigger: 'focus',
          ignoreBounds: 'false',
          isHtml: 'true',
        },
        vAxis: {
          viewWindow: {
            min: 0,
            max: 5
          },
          ticks: [0, 1, 2, 3, 4, 5] 
        }
    };

    public requestSurveyCSV(): void {

      this.dialog.open(EmailTeamDynamicsDialog);
    }

    public showSnackBar(): void {
    this.snackBar.openFromComponent(EmailSentSnackBarComponent, {
      duration: 1000,
    });
  }

  public inTeamDynamics() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/viewresults/teamdynamics") {
            return { 'background-color': '#e28a1d',
                  'color': 'white' };    
        } else {
        return { 'background-color': '#62B3D1',
                  'color': 'white' };
        }
    }
} 

@Component({
  selector: 'emailTeamDynamicsDialog',
  templateUrl: './emailTeamDynamicsResultsDialog.html',
  styleUrls: ['./emailTeamDynamicsResultsDialog.css'],
})
export class EmailTeamDynamicsDialog {
  constructor(public router: Router,  public authService: AuthService, public kumulosService: KumulosService,
              public dialog: MdDialog) {
  }

  public sendSurveyRequest(): void {
    let activeCityVersion: string = localStorage.getItem('activeCityVersion');
      let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));

      let emailAddress: string = userProfile['email'];

      this.kumulosService.sendRequestSurveyCSV(activeCityVersion, emailAddress)
        .subscribe(responseJSON => {
          this.dialog.closeAll();
      });
  }
  
}