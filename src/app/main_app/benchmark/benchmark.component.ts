import { Component } from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';
import { AuthService } from '../../shared/services/auth.service';
import { MdDialog } from '@angular/material';

import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';

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

  emailResults: String;

  constructor(public kumulosService: KumulosService, public dialog: MdDialog, public loadingSnackBar: LoadingSnackBar) {
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

    this.emailResults = "Email Results";
  }


  private getBenchmarkData(): void {

    this.loadingSnackBar.showLoadingSnackBar();

    if (this.hasUser()) {
      let cityID = this.getCityId();
      
      this.kumulosService.getAllBenchmarkData(cityID)
      .subscribe(responseJSON => 
        {
          console.log("All benchmark data");
          console.log(responseJSON.payload);
          this.allCitiesData = responseJSON.payload;
          
          let cityDataLength = this.allCitiesData.length;
          this.currentCityData = this.allCitiesData[cityDataLength - 1];

          this.updateAllCityNames();
          this.mapCityNameToData();
          this.mapCityToVersionId();

          this.currentCitySelected = this.allCityNames[0].value;
          console.log("Response JSON: ");
          console.log(responseJSON.payload[0].versionID);
          localStorage.setItem('benchmarkId', responseJSON.payload[0].versionID);

          this.createComboCharts();
          this.loadingSnackBar.dismissLoadingSnackBar();
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


  // Adds all the cities to a cached array starting from the last city
  private updateAllCityNames(): void {
    for (var i = 0; i < this.allCitiesData.length; i++) {

      if (this.allCitiesData[i]['cityName'])
        this.allCityNames.unshift({label: this.allCitiesData[i]['cityName'], value: {id:i, name: this.allCitiesData[i]['cityName']}});
      else
        this.allCityNames.unshift({label: "Benchmark", value: {id:i, name:"Benchmark"}});
    }
  }

  private mapCityNameToData(): void {

    for (var i = 0; i < this.allCitiesData.length; i++) {
        if (this.allCitiesData[i]['cityName'])
          this.cityNameMappedToData.set(this.allCitiesData[i]['cityName'], this.allCitiesData[i]['aggregateSurveys']);
        else
          this.cityNameMappedToData.set("Benchmark", this.allCitiesData[i]);
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

    this.addToComboChartArray();
  }

  private addToComboChartArray(): void {
    // Clear the existing Combo Chart Array
    this.comboCharts = [];

    // Survey Dashboard for retrieving Area Text and Dimension Texts
    let surveyDashboard: JSON = JSON.parse(localStorage.getItem('surveydashboard'));

    // Last City Data (could be benchmark)
    let lastCityData = this.allCitiesData[this.allCitiesData.length - 1];

    if (lastCityData['aggregateSurveys'])
      lastCityData = lastCityData['aggregateSurveys'];
    
    let lengthLastCityData = lastCityData.length - 1;

    let numOfAreas;
    numOfAreas = Number(lastCityData[lengthLastCityData]['areaID']);

    // Object Data for the current city
    let currentCityData = this.cityNameMappedToData.get(this.currentCitySelected.name);
    
    let dataTableArray: any = new Array();

    for (var i = 1; i <= numOfAreas; i++) {

      let areaText;

      // Adding the headers to each combo chart
      dataTableArray.push(['SurveyData', 'Importance', 'As Is Capability', 'To-Be Capability']);

      for (let j = 0; j <= lengthLastCityData; j++) {
        let dashboardAreaId: Number = Number(lastCityData[j].areaID);

        if (dashboardAreaId == i) {
          // Getting area and dimension texts from survey dashboard
          areaText = surveyDashboard[j].areaText;
          let dimensionText: string = surveyDashboard[j].dimensionText;

          let importance;
          let score;
          let target;

          console.log("Current City Data")
          console.log(currentCityData);

          if (currentCityData[j]) {
            if (currentCityData[j].importance) {
              importance = Number(currentCityData[j].importance);
            } 

            if (currentCityData[j].score) {
              score = Number(currentCityData[j].score);
            } 
            
            if (currentCityData[j].target) {
              target = Number(currentCityData[j].target);
            } 
          } else {
            importance = 0;
            score = 0;
            target = 0;
          }

          dataTableArray.push([dimensionText, importance, score, target]);
        }
      }
      console.log("Area Text: " + areaText);
      console.log("---------------- Area Finished -------------")

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
                }, 
                colors: ['#348bb5', '#e28a1d', '#589e2d'],
                focusTarget: 'category',
                tooltip: {
                  trigger: 'focus',
                  ignoreBounds: 'false',
                  isHtml: 'true',
            },  
          }
        }

      this.comboCharts[i] = comboChart;
      console.log("Form the combo chart: ");
      console.log(this.comboCharts[i]);
      dataTableArray = [];
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