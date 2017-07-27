import { Component } from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';
import { AuthService } from '../../shared/services/auth.service';
import { MdDialog } from '@angular/material';


@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css']
})
export class BenchmarkComponent {

  // Combo Charts holds the 'combo chart' object needed for each graph to display
  public comboCharts: Array<any>;

  // The current city displayed on the combo chart graph
  public currentCityData: Array<any>;

  public allCitiesData: Array<any>;
  public allCityNames: Array<any>;

  // 2 way data bind from view
  private previousCurrentCitySelected: any;
  public currentCitySelected: any;

  public cityNameMappedToData: Map<string, Array<any>>;
  public cityMapToVersionID: Map<string, string>;

  constructor(public kumulosService: KumulosService, public dialog: MdDialog) {
    this.initializeMemberVariables();
    this.getBenchmarkData();
  }

  private initializeMemberVariables(): void {
    this.comboCharts = new Array();
    this.currentCityData = new Array();
    this.allCitiesData = new Array();
    this.allCityNames = new Array();

    this.cityNameMappedToData = new Map<string, Array<any>>();
    this.cityMapToVersionID = new Map<string, string>();
  }


  private getBenchmarkData(): void {
    if (this.hasUser()) {
      let cityID = this.getCityId();
      
      this.kumulosService.getAllBenchmarkData(cityID)
      .subscribe(responseJSON => 
        {
          this.allCitiesData = responseJSON.payload;
          
          // First inflating the Benchmark Data
          let cityDataLength = this.allCitiesData.length;
          this.currentCityData = this.allCitiesData[cityDataLength - 1];

          this.updateAllCityNames();
          this.mapCityNameToData();
          this.mapCityToVersionId();

          this.currentCitySelected = this.allCityNames[0].value;
          localStorage.setItem('benchmarkId', localStorage.getItem('activeCityVersion'));

          this.createComboCharts();
        })
    }
  }

  private hasUser(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  private getCityId(): string {
    let user: JSON = JSON.parse(localStorage.getItem('user'));
    let cityId: string = user['city_id'];
    
    return cityId;
  }

  private updateAllCityNames(): void {
    for (var i = 0; i < this.allCitiesData.length; i++) {

      if (i == this.allCitiesData.length - 1) {
        this.allCityNames.unshift({label: "Benchmark", value: {id:i, name:"Benchmark"}});
      } else {
      this.allCityNames.unshift({label: this.allCitiesData[i]['cityName'], value: {id:i, name: this.allCitiesData[i]['cityName']}});
      }
    }
  }

  private mapCityNameToData(): void {

    for (var i = 0; i < this.allCitiesData.length; i++) {

      if (i == this.allCitiesData.length - 1) {
        this.cityNameMappedToData.set("Benchmark", this.allCitiesData[i]);
      } else {
        this.cityNameMappedToData.set(this.allCitiesData[i]['cityName'], this.allCitiesData[i]['aggregateSurveys']);
      }

    }
  }

  private mapCityToVersionId(): void {
    for (var i = 0; i < this.allCitiesData.length; i++) {

      if (i == this.allCitiesData.length - 1) {
        this.cityMapToVersionID.set("Benchmark", localStorage.getItem('activeCityVersion'));
      } else {
        this.cityMapToVersionID.set(this.allCitiesData[i]['cityName'], this.allCitiesData[i]['versionID']);
      }

    }
  }

  public cityHasChanged() {
    console.log("City has changed: " + this.currentCitySelected.name);

      this.currentCityData = (this.cityNameMappedToData.get(this.currentCitySelected.name));

      console.log("Setting a version ID in local storage");
      console.log(this.cityMapToVersionID.get(this.currentCitySelected.name));
      localStorage.setItem("benchmarkId", this.cityMapToVersionID.get(this.currentCitySelected.name));

      this.createComboCharts();
  }



  // Combo Charts
  private createComboCharts(): void {
    let numberOfAreaModules: number = this.getSizeOfAreaModules();
    this.addToComboChartArray(numberOfAreaModules);
  }

  private getSizeOfAreaModules(): number {
    let surveyDashboard: JSON = JSON.parse(localStorage.getItem('surveydashboard'));
    let sizeOfDashboard: number = Object.keys(surveyDashboard).length;

    let numberOfAreaModules: number = surveyDashboard[sizeOfDashboard - 2]['areaID'];

    return numberOfAreaModules;
  }

  private addToComboChartArray(numberOfModules: number): void {
    let surveyDashboard: JSON = JSON.parse(localStorage.getItem('surveydashboard'));

    for (var currentModule = 1; currentModule <= numberOfModules; currentModule++) {
      let areaText;

      let dataTableArray: any = new Array();
      dataTableArray.push(['SurveyData', 'Importance', 'Score', '2 Year Target' ]);


      for (var i = 0; i < this.currentCityData.length; i++) {
        let areaID = this.currentCityData[i]['areaID'];

        if (areaID == currentModule) {
          // Data returned from Kumulos on the Benchmark request does not contain 'areaText'
          // Retrieving 'areaText' from the surveyDashboard in local storage
          areaText = surveyDashboard[i]['areaText'];
          let dimensionText: string = surveyDashboard[i]['dimensionText']

          let importance: number = Number(this.currentCityData[i]['importance']);
          let score: number = Number(this.currentCityData[i]['score']);
          let target: number = Number(this.currentCityData[i]['target']);

          dataTableArray.push([ dimensionText, importance, score, target ]);

        }
      }

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
  
  public emailBenchmarkData(): void {
    this.dialog.open(EmailBenchmarkResults);
  }
}

@Component({
  selector: 'emailBenchmarkResults',
  templateUrl: './emailBenchmarkResults.html',
  styleUrls: ['./emailBenchmarkResults.css'],
})
export class EmailBenchmarkResults {
  constructor(public kumulosService: KumulosService, public dialog: MdDialog, public authService: AuthService) { }

  public sendSurveyRequest(): void {
    let benchmarkID: string = localStorage.getItem('benchmarkId');
    console.log("benchmark Id: " + benchmarkID);
    let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));

    let emailAddress: string = userProfile['email'];

      this.kumulosService.requestBenchmarkSurveyCSV(benchmarkID, emailAddress)
        .subscribe(responseJSON => {
          console.log(responseJSON.payload);
          this.dialog.closeAll();
      });
  }

}