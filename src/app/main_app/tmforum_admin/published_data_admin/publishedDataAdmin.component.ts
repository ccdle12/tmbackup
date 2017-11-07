import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog, MatTooltip, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgZone, Renderer, ElementRef, ViewChild} from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'publishedDataAdminComponent',
  templateUrl: './publishedDataAdmin.component.html',
  styleUrls: ['./publishedDataAdmin.component.css']
})
export class PublishedDataAdminComponent {

  public backToDashboardTooltip: string;





  constructor(public router: Router, public kumulosService: KumulosService, public dialog: MatDialog,
              public loadingSnackBar: LoadingSnackBar) {
    this.initMemberVariables(); 
    this.getAllOrganizationsAndCompanies();
  }

  private initMemberVariables(): void {
    this.backToDashboardTooltip = "Back To Dashboard";
  }

  /* Kumulos call */
  /* Get all organizations and companies */
  private getAllOrganizationsAndCompanies() {
    this.webGetOrganizations();
  }

  private webGetOrganizations() {
    this.loadingSnackBar.showLoadingSnackBar();

    this.kumulosService.webGetOrganizations().subscribe(response => {
      let listOfOrganizations = response.payload;
  
      if (response.responseCode == 1) {
        listOfOrganizations.forEach(organization => {
          let organizationName = organization.organizationName;
          this.getCompaniesFromOrganizations(organizationName)
        });
      };

      this.loadingSnackBar.dismissLoadingSnackBar();
    });
  }

  private getCompaniesFromOrganizations(organizationName: any) {
    
          this.kumulosService.webGetSurveysByOrg(organizationName).subscribe(response => {
            response.payload.forEach(element => {
              let cityName = element.surveyName;
              let cityID = element.cityID;
              this.getAllBenchmarData(cityName, cityID);
            });
          })
    
  };

  private getAllBenchmarData(surveyName:string, cityID: any) {
    this.kumulosService.getAllBenchmarkData(cityID)
      .subscribe(responseJSON => { console.log(responseJSON)});
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

}