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
  selector: 'surveyAdminComponent',
  templateUrl: './surveyAdmin.component.html',
  styleUrls: ['./surveyAdmin.component.css']
})
export class SurveyAdminComponent {

    public backToDashboardTooltip;
    public companiesInView;
    private organizations;
    private organizationAndCompanyPairs;

    constructor(public router: Router, public kumulosService: KumulosService, public dialog: MatDialog,
                public loadingSnackBar: LoadingSnackBar) {
      this.initMemberVariables(); 
      this.getAllOrganizationsAndCompanies();
    }

    private initMemberVariables(): void {
      this.backToDashboardTooltip = "Back To Dashboard";
      this.companiesInView = new Array();
      this.organizations = new Array();
      this.organizationAndCompanyPairs = new Map<string, JSON[]>();
    }

    /* Kumulos call */
    /* Get all organizations and companies */
    private getAllOrganizationsAndCompanies() {
      this.webGetOrganizations();
    }

    private webGetOrganizations() {
      this.loadingSnackBar.showLoadingSnackBar();

      this.kumulosService.webGetOrganizations().subscribe(response => {

        if (response.responseCode == 1) {
          response.payload.forEach(element => {  
            this.organizations.push(element.organizationName); 
          });

          this.getCompaniesFromOrganizations();
        }
        else {
          console.log("there was an error");
          this.loadingSnackBar.dismissLoadingSnackBar();
        }
      });

    }

    private getCompaniesFromOrganizations() {

      this.organizations.forEach(element => {
        this.kumulosService.webGetSurveysByOrg(element).subscribe(response => {
          this.organizationAndCompanyPairs.set(element, response.payload);
          this.loadingSnackBar.dismissLoadingSnackBar();
        })
      });
    }

    
  
    /* Highlighting the nav tab */
    public inOrganizationAdmin() {
      let currentUrl: string = window.location.pathname;

      if (currentUrl ===  "/main/tmforumadmin/organizationadmin") {
          console.log("returning blue background?");
          return { 'background-color': '#469ac0',
                'color': 'white' };    
      } else {
      console.log(window.location.pathname);
      return { 'background-color': '#62B3D1',
                'color': 'white' };
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
      }
    }

  public backToDashboard(): void {
    this.router.navigateByUrl('/main/takesurvey');
  }


//   /* methods called from view */
//   public addNewOrganization(): void 
//   {
//     let dialogRef = this.dialog.open(AddNewOrgDialog);

//     dialogRef.afterClosed().subscribe(result => {
//         this.webGetOrganizations();
//     });
//   }

//   public editOrganization(index: number): void
//   {
//     let contactEmail = this.organizationsJSON[index].contactEmail;
//     let contactName = this.organizationsJSON[index].contactName;
//     let orgID = this.organizationsJSON[index].organizationID;
//     let organizationName = this.organizationsJSON[index].organizationName;

//     let dialogRef = this.dialog.open(EditOrgDialog, {
//       data: {
//               contactName: contactName,
//               contactEmail: contactEmail,
//               orgID: orgID,
//               organizationName: organizationName
//             }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       this.webGetOrganizations();
//     });
//   }

}