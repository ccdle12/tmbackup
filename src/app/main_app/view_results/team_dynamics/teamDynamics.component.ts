import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';

@Component({
  selector: 'teamDynamicsComponent',
  templateUrl: './teamDynamics.component.html',
  styleUrls: ['./teamDynamics.component.css']
})
export class TeamDynamicsComponent { 

  public candleChartsForDisplay: Array<any>;
  public graphData: Array<any>;
  public numberOfGraphs: number;

  private sortedDataForEachGraph: Array<any>;

  constructor(public router: Router, public kumulosService: KumulosService) {
    this.initializeMemberVariables();
    this.getTeamDynamicsData();
  }

  private initializeMemberVariables(): void {
    this.graphData = new Array();
    this.sortedDataForEachGraph = new Array();
    this.candleChartsForDisplay = new Array();
  }

  private getTeamDynamicsData(): void {
    let activeCityVersion: string = localStorage.getItem('activeCityVersion');

    this.kumulosService.getWhiskerBoxDataByVersion(activeCityVersion)
        .subscribe(responseJSON =>{
          this.graphData = responseJSON.payload;
          this.numberOfGraphs = this.graphData.length;
          this.createCandleCharts();
        })
  }

   public backToDashboard(): void {
    window.location.reload();
    this.router.navigateByUrl('/main');
  }

  public activeBackgroundColor() {
        return { 'background-color': '#1e90ff',
                  'color': 'white' };
    }

  public routeToPage(surveyPage: String) {
    console.log('routetoPage activated: ' + surveyPage);
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
      this.addToCandleChartArray(this.numberOfGraphs - 1);
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
      

      if (currentDimensionID == 0 || currentDimensionID == nextDimensionID) {
        this.sortedDataForEachGraph.unshift([statementId, boxValueLow, boxValueQ1, boxValueQ2, boxValueHigh]);
      } else {
        this.sortedDataForEachGraph.unshift([statementId, boxValueLow, boxValueQ1, boxValueQ2, boxValueHigh]);
        this.sortedDataForEachGraph.unshift(['Sections', 'Low', 'Opening value', 'Closing value', 'High']);
        this.candleChartsForDisplay.unshift(this.sortedDataForEachGraph);
        console.log(this.sortedDataForEachGraph);
        this.sortedDataForEachGraph = [];
      }

      return this.addToCandleChartArray(graphIndexPosition - 1);
    }

    public candle_ChartOptions = {
        legend: 'none',
        bar: { groupWidth: '25%' }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#A9A9A9' }, // red
            risingColor: { strokeWidth: 0, fill: '#A9A9A9' }   // green
        }
    };
  
}