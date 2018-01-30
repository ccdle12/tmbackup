import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog, MatTooltip, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgZone, Renderer, ElementRef, ViewChild } from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { Observable } from 'rxjs/Observable';
import { LicenseService } from '../../../shared/services/license.service';
import { StylingService } from '../../../shared/services/styling.service';

@Component({
  selector: 'publishedDataAdminComponent',
  templateUrl: './publishedDataAdmin.component.html',
  styleUrls: ['./publishedDataAdmin.component.css']
})
export class PublishedDataAdminComponent {

  public backToDashboardTooltip: string;
  public emailResults: string;

  // Combo Charts holds the 'combo chart' object needed for each graph to display
  public comboCharts: Array<any>;

  // The current city displayed on the combo chart graph
  public currentCityData: Array<any>;

  public allCitiesData: Array<any>;
  public allCityNames: Array<any>;

  public cityNameMappedToData: Map<string, Array<any>>;
  public cityMapToVersionID: Map<string, string>;

  // 2 way data bind from view
  private previousCurrentCitySelected: any;
  public currentCitySelected: any;

  isLicenseValid: boolean;

  public surveyDashboard;

  
  constructor(public router: Router, 
              public kumulosService: KumulosService, 
              public dialog: MatDialog,
              public loadingSnackBar: LoadingSnackBar, 
              public licenseService: LicenseService,
              public stylingService: StylingService) {
    this.initMemberVariables(); 
    // this.getAllOrganizationsAndCompanies();

    let cityID = this.getCityId();

    this.kumulosService.webAdminGetAllPublishedData()
      .subscribe(response => {
        this.allCitiesData = response.payload;
          let cityDataLength = this.allCitiesData.length;
          this.currentCityData = this.allCitiesData[cityDataLength - 1];
    
          this.updateAllCityNames();
          this.mapCityNameToData();
    
          this.mapCityToVersionId();
          
          this.currentCitySelected = this.allCityNames[0].value;
          localStorage.setItem('benchmarkId', response.payload[0].versionID);
    
          this.createComboCharts();
          this.loadingSnackBar.dismissLoadingSnackBar();
      })

    // this.kumulosService.getAllBenchmarkData(cityID)
    // .subscribe(response => {
      
    //   this.allCitiesData = response.payload;

    //   let cityDataLength = this.allCitiesData.length;
    //   this.currentCityData = this.allCitiesData[cityDataLength - 1];

    //   this.updateAllCityNames();
    //   this.mapCityNameToData();

    //   this.mapCityToVersionId();
      
    //   this.currentCitySelected = this.allCityNames[0].value;
    //   localStorage.setItem('benchmarkId', response.payload[0].versionID);

    //   this.createComboCharts();
    //   this.loadingSnackBar.dismissLoadingSnackBar();

    // }); 
  }

  public navStyle()
  {
    return {'background-color': this.stylingService.getPrimaryColour('grey')}
  }

  public publishedDataStyle()
  {
    return { 'background-color': this.stylingService.getPrimaryColour('red'),
    'color': 'white' };  
  }
         

   // Adds all the citie names to a cached array starting from the last city
   private updateAllCityNames(): void {
    for (var i = 0; i < this.allCitiesData.length; i++) {

      if (this.allCitiesData[i]['cityName'])
        this.allCityNames.unshift({label: this.allCitiesData[i]['cityName'], value: {id:i, name: this.allCitiesData[i]['cityName']}});
      else
      {
        if (!this.isLicenseValid)
          this.allCityNames.unshift({label: "DEMO Benchmark", value: {id:i, name:"DEMO Benchmark"}});
        else
          this.allCityNames.unshift({label: "Benchmark", value: {id:i, name:"Benchmark"}});
      }
    }
  }

  private mapCityNameToData(): void {
    
        for (var i = 0; i < this.allCitiesData.length; i++) {
            if (this.allCitiesData[i]['cityName'])
              this.cityNameMappedToData.set(this.allCitiesData[i]['cityName'], this.allCitiesData[i]['aggregateSurveys']);
            else
              if (!this.isLicenseValid)
                this.cityNameMappedToData.set("DEMO Benchmark", this.allCitiesData[i]);
              else
                this.cityNameMappedToData.set("Benchmark", this.allCitiesData[i]);
                
        }
  }

  private mapCityToVersionId(): void {
    for (var i = 0; i < this.allCitiesData.length; i++) {

      if (i == this.allCitiesData.length - 1) {
        if (!this.isLicenseValid)
          this.cityMapToVersionID.set("DEMO Benchmark", localStorage.getItem('activeCityVersion'));
        else
          this.cityMapToVersionID.set("Benchmark", localStorage.getItem('activeCityVersion'));
      } else {
        this.cityMapToVersionID.set(this.allCitiesData[i]['cityName'], this.allCitiesData[i]['versionID']);
      }

    }
  }

  private setIsLicenseValid()
  {
    this.isLicenseValid = this.licenseService.isLicenseValid();
    // console.log("is license valid: " + this.isLicenseValid);
  }

  private initMemberVariables(): void {
    this.comboCharts = new Array();
    this.currentCityData = new Array();
    this.allCitiesData = new Array();
    this.allCityNames = new Array();

    this.cityNameMappedToData = new Map<string, Array<any>>();
    this.cityMapToVersionID = new Map<string, string>();

    // this.emailResults = "Email Results";

    // Survey Dashboard holding Area Text and Dimension Texts
    this.surveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));

    this.backToDashboardTooltip = "Back to Dashboard"
    this.emailResults = "Email Results"
  }

  private getCityId(): string {
    let user: JSON = JSON.parse(localStorage.getItem('user'));
    let cityId: string = user['city_id'];

    return cityId;
  }

  // Combo Charts
  private createComboCharts(): void {
    
        this.addToComboChartArray();
      }
    
      private addToComboChartArray(): void {
        // Clear the existing Combo Chart Array
        this.comboCharts = [];
    
        let dimensionToIndexPos = new Map<Number, Number>();
    
        // Last City Data in the payload from getAllBenchMarkData (most likely will be benchmark data)
        // console.log("Last city: ") 
        // console.log(this.allCitiesData[this.allCitiesData.length -1]);
        let lastCityData = this.allCitiesData[this.allCitiesData.length - 1];
    
        //Check if last city data has aggregate surveys, if they do then this is not the benchmark data
        if (lastCityData['aggregateSurveys'])
          lastCityData = lastCityData['aggregateSurveys'];
        
        //Number of area modules
        let lengthLastCityData = lastCityData.length - 1;
    
        let numOfAreas;
        numOfAreas = Number(lastCityData[lengthLastCityData]['areaID']);
    
        // Object Data for the current city
        let currentCityData = this.cityNameMappedToData.get(this.currentCitySelected.name);
        console.log("FETCHED CURRENT CITY DATA:")
        console.log(currentCityData);
        
        let dataTableArray: any = new Array();
    
    
        //testing caching object until a matching dimensionId occurs
        let cachedObject = currentCityData[0];
    
        for (let i = 0; i <= lengthLastCityData; i++)
        {
          dimensionToIndexPos.set(i, Number(this.surveyDashboard[i].dimensionID));
        }
    
        for (var i = 1; i <= numOfAreas; i++) {
    
          let areaText;
    
          // Adding the headers to each combo chart
          dataTableArray.push(['SurveyData', 'Importance', 'As Is Capability', 'To-Be Capability']);
            
          for (let j = 0; j <= lengthLastCityData; j++) {
            let dashboardAreaId: Number = Number(lastCityData[j].areaID);
            let dimensionId = lastCityData[j].dimensionID;
    
            if (dashboardAreaId == i) {
              // Getting area and dimension texts from survey dashboard
              let dimensionText: string = this.surveyDashboard[j].dimensionText;
              let dimensionId: string = this.surveyDashboard[j].dimensionID;
    
              areaText = this.surveyDashboard[j].areaText;
    
              let importance;
              let score;
              let target;
    
              if (cachedObject && Number(cachedObject.dimensionID) == dimensionToIndexPos.get(j)) 
              {
                if (cachedObject.importance)
                  importance = Number(cachedObject.importance);
    
                if (cachedObject.score)
                  score = Number(cachedObject.score);      
                
                if (cachedObject.target)
                  target = Number(cachedObject.target);
    
                cachedObject = currentCityData[j + 1];
              }
              else 
              {
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
                    colors: 
                    [
                      this.stylingService.getHexPrimaryColour('grey'), 
                      this.stylingService.getHexPrimaryColour('black'), 
                      this.stylingService.getHexPrimaryColour('red')
                    ],
                    focusTarget: 'category',
                    tooltip: {
                      trigger: 'focus',
                      ignoreBounds: 'false',
                      isHtml: 'true',
                },  
              }
            }
    
          this.comboCharts[i] = comboChart;
          dataTableArray = [];
        }
      }

  /* Nav Bar Routing */
  public routeToPage(surveyPage: String) 
  {
    switch(surveyPage) 
    {
      case('organizationadmin'):
        this.router.navigateByUrl('/main/tmforumadmin/organizationadmin');
        break;

      case ('surveyadmin'):
        this.router.navigateByUrl('main/tmforumadmin/surveyadmin');
        break;

      case ('useradmin'):
        this.router.navigateByUrl('main/tmforumadmin/useradmin');
        break;
        
      case ('benchmarkdata'):
        this.router.navigateByUrl('main/tmforumadmin/benchmarkdata');
        break;

      case ('bulkinviteadmin'):
        this.router.navigateByUrl('main/tmforumadmin/bulkinviteadmin');
        break;
      
      case('publisheddataadmin'):
        this.router.navigateByUrl('main/tmforumadmin/publisheddataadmin');
        break;
      }
    }

  public backToDashboard(): void {
    this.router.navigateByUrl('/main/takesurvey');
  }


  public cityHasChanged() {
     this.currentCityData = (this.cityNameMappedToData.get(this.currentCitySelected.name));
      this.createComboCharts();
  }

  public requestSurveyCSV(): void {
    this.dialog.open(PublishedDataEmailResultsDialog);
}
}

@Component({
  selector: 'publishedDataEmailResults',
  templateUrl: './publishedDataEmailResults.html',
  styleUrls: ['./publishedDataEmailResults.css'],
})
export class PublishedDataEmailResultsDialog {

  public httpRequestFlag: boolean;

  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(public router: Router,  
              public authService: AuthService, 
              public kumulosService: KumulosService,
              public dialog: MatDialog) { }

  public sendSurveyRequest(): void {
    let userProfile: JSON = JSON.parse(localStorage.getItem('userProfile'));

    let emailAddress: string = userProfile['email'];
    console.log("EMAIL ADDRESS");
    console.log(emailAddress);

    this.httpRequestFlag = true;
      this.kumulosService.webAdminRequestPublishedDataCSV(emailAddress)
        .subscribe(responseJSON => {
          console.log("Request for csv extract");
          console.log(responseJSON.payload);
          this.dialog.closeAll();
      });
  }

}
