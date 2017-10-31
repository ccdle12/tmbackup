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

  public backToDashboardTooltip: string;
  public companiesInView: Array<any>;
  public organizations: Array<any>;
  public currentOrganizationSelected: any;

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
          this.organizations.push({label: element.organizationName, value: {id:element.organizationName, name: element.organizationName}});  
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

      this.kumulosService.webGetSurveysByOrg(element.value.name).subscribe(response => {
        this.organizationAndCompanyPairs.set(element.value.name, response.payload);
        
        this.currentOrganizationSelected = this.organizations[0].value;
        this.updateCompaniesInView();

        this.loadingSnackBar.dismissLoadingSnackBar();
      })

    });
  }

  private updateCompaniesInView(): void {
    this.companiesInView = this.organizationAndCompanyPairs.get(this.currentOrganizationSelected.name);
  }



  
  /* Highlighting the nav tab */
  public inOrganizationAdmin() {
    let currentUrl: string = window.location.pathname;

    if (currentUrl ===  "/main/tmforumadmin/organizationadmin") {
        return { 'background-color': '#469ac0',
              'color': 'white' };    
    } else {
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




/* Methods called from view */
public organizationHasChanged(): void {
  this.updateCompaniesInView();

  console.log("Current Org: ");
  console.log(this.currentOrganizationSelected.name);
  console.log(this.companiesInView);
}

public editCompany(company: any): void {
  console.log(company);

    let dialogRef = this.dialog.open(EditCompanyDialog, {
      data: {
              orgName: this.currentOrganizationSelected.name,
              company: company
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllOrganizationsAndCompanies();
    });
    }
}

@Component({
  selector: 'editCompanyDialog',
  templateUrl: './edit_company_dialog/editCompanyDialog.html',
  styleUrls: ['./edit_company_dialog/editCompanyDialog.css']
})
export class EditCompanyDialog {

  public httpRequestFlag: boolean;
  public company: any;
  public userMadeChangesFlag;
  public editCompanyForm: FormGroup;
  public orgName;

  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
              private formBuilder: FormBuilder,
              public kumulosService: KumulosService, 
              public dialog: MatDialog) 
  {
    this.initMemberVariables();
    this.unpackInjectedData(data);
    this.initEditCompanyForm();
    this.setOrganizationFormListener();
  }

  private initMemberVariables(): void
  {
    this.userMadeChangesFlag = false; 
  }

  private unpackInjectedData(data: any): void
  {
    this.company = data.company;
    this.orgName = data.orgName;
  }

  private initEditCompanyForm(): void 
  {
    let startDate = new Date(parseInt(this.company.startDate) * 1000);
    let expiryDate = new Date(parseInt(this.company.expiryDate) * 1000);

    this.editCompanyForm = this.formBuilder.group({
      name: [this.company.name],
      license: [this.company.licenseType],
      maxUsers: [this.company.maxUsers],
      validFrom: [startDate],
      validTo: [expiryDate],
      archive: [''],
     });
  }

  private setOrganizationFormListener(){
    this.editCompanyForm.valueChanges.subscribe(data => {
      this.userMadeChangesFlag = true;
   });
  }

  public editCompany(): void {
    this.httpRequestFlag = true;
    this.kumulosService.webCreateUpdateSurveys(this.orgName, this.editCompanyForm.value, this.company.cityID, this.editCompanyForm.value.archive).subscribe(responseJSON => {
      this.dialog.closeAll();
    })

  }

  public enableSubmitButton(): boolean 
  {
    let submitButtonState: boolean = true;

    if (this.userMadeChangesFlag)
      submitButtonState = false;

    return submitButtonState;
  }

  onSubmit() {}
}