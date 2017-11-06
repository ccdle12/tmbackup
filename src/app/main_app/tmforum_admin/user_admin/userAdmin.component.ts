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
  selector: 'userAdminComponent',
  templateUrl: './userAdmin.component.html',
  styleUrls: ['./userAdmin.component.css']
})
export class UserAdminComponent {

  public backToDashboardTooltip: string;
  public organizations: Array<any>;
  public organizationAndCompanyPairs: Map<string, JSON[]>;
  public surveyGroupAndUserPairs: Map<string, JSON[]>;
  

  public surveyGroupsDropDown: Array<any>;
  public currentSurveyGroupSelected: any;

  constructor(public router: Router, public kumulosService: KumulosService, public dialog: MatDialog,
              public loadingSnackBar: LoadingSnackBar) {
    this.initMemberVariables(); 
    this.getAllOrganizationsAndCompanies();
  }

  private initMemberVariables(): void {
    this.backToDashboardTooltip = "Back To Dashboard";
    this.organizations = new Array();
    this.organizationAndCompanyPairs = new Map<string, JSON[]>();
    this.surveyGroupAndUserPairs = new Map<string, JSON[]>();

    this.surveyGroupsDropDown = new Array();
    // this.currentSurveyGroupSelected = new Map<string, JSON[]>();
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
          let organizationName = element.organizationName;

          this.organizations.push({label: organizationName, value: {id:organizationName, name: organizationName}});  
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

    this.organizations.forEach(organization => {

      let organizationName = organization.value.name;

      this.kumulosService.webGetSurveysByOrg(organizationName).subscribe(response => {
        this.organizationAndCompanyPairs.set(organizationName, response.payload);      
        // this.currentOrganizationSelected = this.organizations[0].value;
        // this.updateCompaniesInView();

        // this.loadingSnackBar.dismissLoadingSnackBar();

        let listOfCompanies = this.organizationAndCompanyPairs.get(organizationName);
        this.getUsersFromCompanies(listOfCompanies);
      })
    });

  }

  private getUsersFromCompanies(companies: any) {
    companies.forEach(eachCompany => {
      this.kumulosService.getWebUsersCityIdOverload(eachCompany.cityID).subscribe(response => {
        console.log("CITY ID: " + eachCompany.cityID);
        console.log("GETTING USERS:");
        console.log(response);
      });
    })
  }

//   private updateCompaniesInView(): void {
//     this.companiesInView = this.organizationAndCompanyPairs.get(this.currentOrganizationSelected.name);
//   }



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
      }
    }

  public backToDashboard(): void {
    this.router.navigateByUrl('/main/takesurvey');
  }




/* Methods called from view */
public surveyGroupHasChanged(): void {
  // this.updateCompaniesInView();

  // console.log("Current Org: ");
  // console.log(this.currentOrganizationSelected.name);
  // console.log(this.companiesInView);
}

// public addCompany(): void {
//   let dialogRef = this.dialog.open(AddCompanyDialog, {
//     data: {
//             orgName: this.currentOrganizationSelected.name,
//           }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     this.getAllOrganizationsAndCompanies();
//   });
// }

// public editCompany(company: any): void {
//   console.log(company);

//     let dialogRef = this.dialog.open(EditCompanyDialog, {
//       data: {
//               orgName: this.currentOrganizationSelected.name,
//               company: company
//             }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       this.getAllOrganizationsAndCompanies();
//     });
//   }
}