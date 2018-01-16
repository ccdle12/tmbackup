import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material';

import { MatDialog, MatTooltip } from '@angular/material';

import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';
import { MatCard } from '@angular/material';


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
  public mapOfDescriptorToStatementID: Map<string, string>;

  constructor(public router: Router, public kumulosService: KumulosService, public snackBar: MatSnackBar, 
    public loadingSnackBar: LoadingSnackBar, public authService: AuthService, public dialog: MatDialog) {

      // this.loadingSnackBar.showLoadingSnackBar();

      this.initInstanceVariables();
      this.initMapDescriptor();
      
      // this.getHeatMapData();
      this.getWebDashboard();
  }

  private initInstanceVariables() {
    this.surveyDashboard = new Array();
    this.heatMapJSON = new Array();
    this.surveyModules = new Array();
    this.sectionModules = new Array();
    this.sortedSurveyAndHeatMap = new Array();
    this.mapOfDescriptorToStatementID = new Map();
  }

  private initMapDescriptor() {
    this.mapOfDescriptorToStatementID.set("1.1.1", "Inferred personalisation");
    this.mapOfDescriptorToStatementID.set("1.1.2", "Targeted content");
    this.mapOfDescriptorToStatementID.set("1.1.3", "Self personalization");
    this.mapOfDescriptorToStatementID.set("1.1.4", "Digital tools");
    this.mapOfDescriptorToStatementID.set("1.1.5", "Seamlessness");
    this.mapOfDescriptorToStatementID.set("1.1.6", "Digital interactions");
    this.mapOfDescriptorToStatementID.set("1.2.1", "Digital vision");
    this.mapOfDescriptorToStatementID.set("1.2.10", "Partner alignment");
    this.mapOfDescriptorToStatementID.set("1.2.2", "Ways of working");
    this.mapOfDescriptorToStatementID.set("1.2.3", "Budget investment");
    this.mapOfDescriptorToStatementID.set("1.2.4", "Automation");
    this.mapOfDescriptorToStatementID.set("1.2.5", "Current needs");
    this.mapOfDescriptorToStatementID.set("1.2.6", "Future needs");
    this.mapOfDescriptorToStatementID.set("1.2.7", "Omnichannel");
    this.mapOfDescriptorToStatementID.set("1.2.8", "Profile management");
    this.mapOfDescriptorToStatementID.set("1.2.9", "Digital service");
    this.mapOfDescriptorToStatementID.set("1.3.1", "Customer view");
   this.mapOfDescriptorToStatementID.set("1.3.2",  "Shared insights");
    this.mapOfDescriptorToStatementID.set("1.3.3", "Multi-channel profiling");
    this.mapOfDescriptorToStatementID.set("1.3.4", "Group profiles");
    this.mapOfDescriptorToStatementID.set("1.3.5", "Social media");
    this.mapOfDescriptorToStatementID.set("1.3.6", "Digital interactions");
   this.mapOfDescriptorToStatementID.set("1.3.7",  "Customer culture"); 

   this.mapOfDescriptorToStatementID.set("1.4.1", " empty ");
   this.mapOfDescriptorToStatementID.set("1.4.2","Negative follow-up")
   this.mapOfDescriptorToStatementID.set("1.4.3","Easy to do business")
   this.mapOfDescriptorToStatementID.set("1.4.4", "Complaints")
   this.mapOfDescriptorToStatementID.set("1.4.5", "Privacy trust")
   this.mapOfDescriptorToStatementID.set("1.4.6", "Third party transparency")
   this.mapOfDescriptorToStatementID.set("1.4.7",  "Data trust")
   this.mapOfDescriptorToStatementID.set("1.4.8",  "Fulfilment trust") 
   this.mapOfDescriptorToStatementID.set("2.1.1","Branding strategy")
   this.mapOfDescriptorToStatementID.set("2.1.2","Branding guidelines")
   this.mapOfDescriptorToStatementID.set("2.1.3","Brand governance")
   this.mapOfDescriptorToStatementID.set("2.1.4","Loyalty metrics")
   this.mapOfDescriptorToStatementID.set("2.1.5", "Insight-led")

   
   this.mapOfDescriptorToStatementID.set("2.2.1", "Business model")
   this.mapOfDescriptorToStatementID.set("2.2.2", "Joint ownership")
   this.mapOfDescriptorToStatementID.set("2.2.3","On-boarding")
   this.mapOfDescriptorToStatementID.set("2.2.4","Relationship management")
   this.mapOfDescriptorToStatementID.set("2.2.5", "Motivation management") 

   
   this.mapOfDescriptorToStatementID.set("2.3.1", "Investment capital")
   this.mapOfDescriptorToStatementID.set("2.3.2", "Investment management")
   this.mapOfDescriptorToStatementID.set("2.3.3","Long term ROI")
   this.mapOfDescriptorToStatementID.set("2.3.4","Feedback & learning")
   this.mapOfDescriptorToStatementID.set("2.3.5","Financial modelling") 
   
   this.mapOfDescriptorToStatementID.set("2.4.1", "Strategic alignment")
   this.mapOfDescriptorToStatementID.set("2.4.2","Intelligence")
   this.mapOfDescriptorToStatementID.set("2.4.3","Benchmarking")
   this.mapOfDescriptorToStatementID.set("2.4.4","Digital marketing") 

    
   this.mapOfDescriptorToStatementID.set("2.5.1","Digital portfolio")
   this.mapOfDescriptorToStatementID.set("2.5.2","Delivery options")
   this.mapOfDescriptorToStatementID.set("2.5.3","Market-shaping")
   this.mapOfDescriptorToStatementID.set("2.5.4",'Digital knowledge')
   this.mapOfDescriptorToStatementID.set("2.5.5", 'Innovation process') 

   
   this.mapOfDescriptorToStatementID.set("2.6.1", 'Engagement')
   this.mapOfDescriptorToStatementID.set("2.6.2",'Identification')
   this.mapOfDescriptorToStatementID.set("2.6.3", 'Partnership focus')
   this.mapOfDescriptorToStatementID.set("2.6.4",'Communications')

   this.mapOfDescriptorToStatementID.set("2.7.1", 'Goals & objectives')
   this.mapOfDescriptorToStatementID.set("2.7.2", 'Communications')
   this.mapOfDescriptorToStatementID.set("2.7.3", 'Goal alignment')
   this.mapOfDescriptorToStatementID.set("2.7.4",'Roadmaps & plans')
   this.mapOfDescriptorToStatementID.set("2.7.5",'Decision-making') 

   this.mapOfDescriptorToStatementID.set("3.1.1",'Front-end dev')
   this.mapOfDescriptorToStatementID.set("3.1.10", 'Environment')
   this.mapOfDescriptorToStatementID.set("3.1.2", 'Project mode')
   this.mapOfDescriptorToStatementID.set("3.1.3",  'Design APIs')
   this.mapOfDescriptorToStatementID.set("3.1.4", 'Build APIs')
   this.mapOfDescriptorToStatementID.set("3.1.5", 'Run APIs')
   this.mapOfDescriptorToStatementID.set("3.1.6",  'APM')
   this.mapOfDescriptorToStatementID.set("3.1.7", 'Cloud environment')
   this.mapOfDescriptorToStatementID.set("3.1.8",  'Digital architecture')
   this.mapOfDescriptorToStatementID.set("3.1.9", 'Migration') 

   
   this.mapOfDescriptorToStatementID.set("3.2.1", 'Lifecycle management')
   this.mapOfDescriptorToStatementID.set("3.2.2",'In-boarding')
   this.mapOfDescriptorToStatementID.set("3.2.3",'Security') 

   
   this.mapOfDescriptorToStatementID.set("3.3.1", 'Data model')
   this.mapOfDescriptorToStatementID.set("3.3.2",'Big data & analytics')
   this.mapOfDescriptorToStatementID.set("3.3.3", 'Lifecycle data')
   this.mapOfDescriptorToStatementID.set("3.3.4",'Big data platform')
   this.mapOfDescriptorToStatementID.set("3.3.5", 'Compliance')
   this.mapOfDescriptorToStatementID.set("3.3.6",  'Methodology')
   this.mapOfDescriptorToStatementID.set("3.3.7",  'Decisioning') 

   
   this.mapOfDescriptorToStatementID.set("3.4.1",  'Agility')
   this.mapOfDescriptorToStatementID.set("3.4.2", 'Teams')
   this.mapOfDescriptorToStatementID.set("3.4.3", 'Dev Ops')
   this.mapOfDescriptorToStatementID.set("3.4.4", 'Promotion')
   this.mapOfDescriptorToStatementID.set("3.4.5", 'Reviews')
   this.mapOfDescriptorToStatementID.set("3.4.6",  'IT operating model')
   this.mapOfDescriptorToStatementID.set("3.4.7",  'Project roadmaps') 

   
   this.mapOfDescriptorToStatementID.set("3.5.1",'Infrastructure')
   this.mapOfDescriptorToStatementID.set("3.5.2", 'IT virtualization')
   this.mapOfDescriptorToStatementID.set("3.5.3",'Network functions')
   this.mapOfDescriptorToStatementID.set("3.5.4",'Network as a service')
   this.mapOfDescriptorToStatementID.set("3.5.5", 'Monitoring')
   this.mapOfDescriptorToStatementID.set("3.5.6",'Computing power') 

   
   this.mapOfDescriptorToStatementID.set("3.6.1", 'Security by design')
   this.mapOfDescriptorToStatementID.set("3.6.2", 'Secure isolation')
   this.mapOfDescriptorToStatementID.set("3.6.3", 'Threat escalation')
   this.mapOfDescriptorToStatementID.set("3.6.4", 'Threat resolution')
   this.mapOfDescriptorToStatementID.set("3.6.5", 'Threat mitigation')
   this.mapOfDescriptorToStatementID.set("3.6.6", 'Security measures')
   this.mapOfDescriptorToStatementID.set("3.6.7", 'Data science solution') 

   
   this.mapOfDescriptorToStatementID.set("3.7.1",'Technology strategy')
   this.mapOfDescriptorToStatementID.set("3.7.2", 'SOA')
   this.mapOfDescriptorToStatementID.set("3.7.3",'Future-proofing')
   this.mapOfDescriptorToStatementID.set("3.7.4", 'Open source')
   this.mapOfDescriptorToStatementID.set("3.7.5",'E2E migration') 

   
   this.mapOfDescriptorToStatementID.set("4.1.1", 'Agile governance')
   this.mapOfDescriptorToStatementID.set("4.1.10", 'Rollback')
   this.mapOfDescriptorToStatementID.set("4.1.11", 'Data integrity')
   this.mapOfDescriptorToStatementID.set("4.1.2",  'Collaboration')
   this.mapOfDescriptorToStatementID.set("4.1.3", 'Business reqs')
   this.mapOfDescriptorToStatementID.set("4.1.4", 'Digital ops reqs')
   this.mapOfDescriptorToStatementID.set("4.1.5", 'Design')
   this.mapOfDescriptorToStatementID.set("4.1.6",'Testing')
   this.mapOfDescriptorToStatementID.set("4.1.7", 'Monitoring')
   this.mapOfDescriptorToStatementID.set("4.1.8",  'Deployment')
   this.mapOfDescriptorToStatementID.set("4.1.9", 'Version management') 

   
   this.mapOfDescriptorToStatementID.set("4.2.1", 'Digitization')
   this.mapOfDescriptorToStatementID.set("4.2.2", 'Asset management')
   this.mapOfDescriptorToStatementID.set("4.2.3", 'Associations')
   this.mapOfDescriptorToStatementID.set("4.2.4",'Live monitoring')
   this.mapOfDescriptorToStatementID.set("4.2.5",'Auditing')
   this.mapOfDescriptorToStatementID.set("4.2.6",  'Lifecycle management') 

   
   this.mapOfDescriptorToStatementID.set("4.3.1",'Service mapping')
    this.mapOfDescriptorToStatementID.set("4.3.10",'Openness')
    this.mapOfDescriptorToStatementID.set("4.3.2",'Service design')
    this.mapOfDescriptorToStatementID.set("4.3.3",'Operations process')
    this.mapOfDescriptorToStatementID.set("4.3.4",'Zero-touch')
    this.mapOfDescriptorToStatementID.set("4.3.5",'Digital worflows')
    this.mapOfDescriptorToStatementID.set("4.3.6",'Service catalogue')
    this.mapOfDescriptorToStatementID.set("4.3.7",'Security management')
    this.mapOfDescriptorToStatementID.set("4.3.8",'Service quality')
    this.mapOfDescriptorToStatementID.set("4.3.9",'Incident management') 

    
    this.mapOfDescriptorToStatementID.set("4.4.1",'Multi-disciplinary team')
    this.mapOfDescriptorToStatementID.set("4.4.10",'Adaptation')
    this.mapOfDescriptorToStatementID.set("4.4.11",'Trusted insight')
    this.mapOfDescriptorToStatementID.set("4.4.12",'Learning')
    this.mapOfDescriptorToStatementID.set("4.4.2",'Big data analysis')
    this.mapOfDescriptorToStatementID.set("4.4.3",'Streaming data')
    this.mapOfDescriptorToStatementID.set("4.4.4",'Digital tools')
    this.mapOfDescriptorToStatementID.set("4.4.5",'Rules & algorithms')
    this.mapOfDescriptorToStatementID.set("4.4.6",'Ecosystem insights')
    this.mapOfDescriptorToStatementID.set("4.4.7",'Trends discovery')
    this.mapOfDescriptorToStatementID.set("4.4.8",'Future events management')
    this.mapOfDescriptorToStatementID.set("4.4.9",'Future outcomes')

   
     this.mapOfDescriptorToStatementID.set("4.5.1",'Design')
     this.mapOfDescriptorToStatementID.set("4.5.2",'Execution')
     this.mapOfDescriptorToStatementID.set("4.5.3",'Control')
     this.mapOfDescriptorToStatementID.set("4.5.4",'Seamlessness')
     this.mapOfDescriptorToStatementID.set("4.5.5",'Monitoring') 

     
     this.mapOfDescriptorToStatementID.set("4.6.1", 'Ecosystem controls')
     this.mapOfDescriptorToStatementID.set("4.6.2", 'Digital standards')
     this.mapOfDescriptorToStatementID.set("4.6.3",'Performance & risk')
     this.mapOfDescriptorToStatementID.set("4.6.4", 'Compliance')
     this.mapOfDescriptorToStatementID.set("4.6.5", 'Legal & regulatory')
     this.mapOfDescriptorToStatementID.set("4.6.6", 'Alignment') 
     
     
    this.mapOfDescriptorToStatementID.set("5.1.1",'Behaviours')
    this.mapOfDescriptorToStatementID.set("5.1.2",'Leadership comms')
    this.mapOfDescriptorToStatementID.set("5.1.3",'Empowerment')
    this.mapOfDescriptorToStatementID.set("5.1.4",'Shared values')
    this.mapOfDescriptorToStatementID.set("5.1.5",'Beliefs') 

    
    this.mapOfDescriptorToStatementID.set("5.2.1",'Sensing')
    this.mapOfDescriptorToStatementID.set("5.2.2",'Accountability')
    this.mapOfDescriptorToStatementID.set("5.2.3",'Enabling')
    this.mapOfDescriptorToStatementID.set("5.2.4",'Executing')
    this.mapOfDescriptorToStatementID.set("5.2.5",'Leadership') 

    
    this.mapOfDescriptorToStatementID.set("5.3.1", 'Mission & objectives')
    this.mapOfDescriptorToStatementID.set("5.3.2",'Collaboration')
    this.mapOfDescriptorToStatementID.set("5.3.3",'Digital skills')
    this.mapOfDescriptorToStatementID.set("5.3.4",'Work structures')
    this.mapOfDescriptorToStatementID.set("5.3.5",'Learning') 

    
    this.mapOfDescriptorToStatementID.set("5.4.1",'Digital apps')
    this.mapOfDescriptorToStatementID.set("5.4.2",'Assets')
    this.mapOfDescriptorToStatementID.set("5.4.3",'Digital platforms')
    this.mapOfDescriptorToStatementID.set("5.4.4",'Remote working')
    this.mapOfDescriptorToStatementID.set("5.4.5",'Investment')
  }

  /**
   * Functions to unpack the heat map data
   */
  public getWebDashboard() {

    let version = this.getActiveVersion();
    console.log(version);

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

  public getHeatMapData() {
    console.log(this.surveyModules[this.surveyModules.length-1]);
    let version = this.getActiveVersion();
    this.kumulosService.webGetHeatMap(version).subscribe(response => {

      //Adding the payload to heat map json
      this.loadingSnackBar.dismissLoadingSnackBar();
      this.heatMapJSON = response.payload;

      // Unpack heat map data into [][] array corresponding to each survey module index position
      this.unpackHeatMap();

      console.log("Unpack 0 of 0");
      console.log(this.sortedSurveyAndHeatMap);
      console.log(this.sortedSurveyAndHeatMap[this.surveyModules.length-1][this.sectionModules.length][0]["statementText"]);
      // console.log(this.getStatementText(2, 4, 2));

      console.log("Survey Modules: ");
      console.log(this.surveyModules);
    });
  }

  public addModules(size: number): void {
    
    if (size < 0)
      return;

    let currentAreaId: number = this.surveyDashboard[size]['areaID'];
    console.log("AREA ID: " + currentAreaId);
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
        return { 'background-color': '#469ac0',
              'color': 'white' };    
    } else {
    console.log(window.location.pathname);
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

  console.log("Is Logged In: " + loggedIn);
  console.log("Is Leader: " + isLeaderOrConsultant);

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

public getStatementText(i, j ,k) {
  let statementID = this.sortedSurveyAndHeatMap[i][j][k]["statementID"];
  return this.mapOfDescriptorToStatementID.get(statementID);
}

public getHeatMapItems(i, j) {
  console.log(this.sortedSurveyAndHeatMap[i][j]);
  return this.sortedSurveyAndHeatMap[i][j];
}
}
