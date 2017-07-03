import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { MdSnackBar } from '@angular/material';
import { EmailSentSnackBarComponent } from '../my_own_results/myOwnResults.component';


@Component({
  selector: 'organizationResultsComponent',
  templateUrl: './organizationResults.component.html',
  styleUrls: ['./organizationResults.component.css']
})
export class OrganizationResultsComponent { 

  public comboCharts: Array<any>;
  public graphData: Array<any>;

  constructor(public router: Router, public kumulosService: KumulosService, public snackBar: MdSnackBar) {
    this.initializeMemberVariables();
    this.getOwnResultsData();
  }

   private initializeMemberVariables(): void {
    this.graphData = new Array();
    this.comboCharts = new Array();
  }

  private getOwnResultsData(): any { 
    let activeCityVersion: string = localStorage.getItem('activeCityVersion');
    let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));
    
    this.kumulosService.getAggregatesForOrganizationResults(activeCityVersion)
        .subscribe(responseJSON => {
          this.graphData = responseJSON.payload;
          this.createComboCharts();
    });
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

  
  private createComboCharts(): void {
    
    let numberOfAreaModules = this.getSizeOfAreaModules();
    this.addToComboChartArray(numberOfAreaModules);
  }

  private getSizeOfAreaModules(): number {
    let surveyDashboard: JSON = JSON.parse(localStorage.getItem('surveydashboard'));
    let sizeOfDashboard: number = Object.keys(surveyDashboard).length;

    let numberOfAreaModules: number = surveyDashboard[sizeOfDashboard - 2]['areaID'];

    return numberOfAreaModules;
  }

  private addToComboChartArray(numberOfModules: number): void {
    for (var currentModule = 1; currentModule <= numberOfModules; currentModule++) {
      let areaText;

      let dataTableArray: any = new Array();
      dataTableArray.push(['SurveyData', 'Importance', 'Score', '2 Year Target' ]);


      for (var i = 0; i < this.graphData.length; i++) {
        let areaID = this.graphData[i]['areaID'];

        if (areaID == currentModule) {
          areaText = this.graphData[i]['areaText'];
          let dimensionText: string = this.graphData[i]['dimensionText']
          let importance: number = Number(this.graphData[i]['importance']);
          let score: number = Number(this.graphData[i]['score']);
          let target: number = Number(this.graphData[i]['target']);

          dataTableArray.push([ dimensionText, importance, score, target ]);

        }
      }

      console.log("CREATING COMBOCHART");
      console.log("current area text: " + areaText);
      let comboChart = {
            chartType: 'ComboChart',
            dataTable: dataTableArray,
            options: {
              title : areaText,
              seriesType: 'bars',
              vAxis: {
                viewWindow: {
                  min: 0,
                  max: 5
                },
                  ticks: [0, 1, 2, 3, 4, 5] 
                }
              }
            }
      this.comboCharts[currentModule] = comboChart;
    }
  }

  public backToDashboard(): void {
    window.location.reload();
    this.router.navigateByUrl('/main');
  }

  public requestSurveyCSV(): void {
    let activeCityVersion: string = localStorage.getItem('activeCityVersion');
    let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));

    let emailAddress: string = userProfile['email'];

    console.log("Active city version: ", activeCityVersion);
    console.log("emailAddress: ", emailAddress);

    this.kumulosService.sendRequestSurveyCSV(activeCityVersion, emailAddress)
      .subscribe(responseJSON => {
        console.log(responseJSON.payload);
        this.showSnackBar();
    });
  }

  public activeBackgroundColor() {
        return { 'background-color': '#1e90ff',
                  'color': 'white' };
    }

  public showSnackBar(): void {
    this.snackBar.openFromComponent(EmailSentSnackBarComponent, {
      duration: 1000,
    });
  }   
}