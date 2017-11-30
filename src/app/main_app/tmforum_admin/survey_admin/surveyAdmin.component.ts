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
      console.log("web get orgs");
      console.log(response);
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




/* Methods called from view */
public organizationHasChanged(): void {
  this.updateCompaniesInView();

  console.log("Current Org: ");
  console.log(this.currentOrganizationSelected.name);
  console.log(this.companiesInView);
}

public addCompany(): void {
  let dialogRef = this.dialog.open(AddCompanyDialog, {
    data: {
            orgName: this.currentOrganizationSelected.name,
          }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.organizations = [];
    this.getAllOrganizationsAndCompanies();
  });
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
      this.organizations = [];
      this.getAllOrganizationsAndCompanies();
    });
  }
}

@Component({
  selector: 'addCompanyDialog',
  templateUrl: './add_company_dialog/addCompanyDialog.html',
  styleUrls: ['./add_company_dialog/addCompanyDialog.css']
})
export class AddCompanyDialog {

  public httpRequestFlag: boolean;
  // public company: any;
  public userMadeChangesFlag;
  public addCompanyForm: FormGroup;
  public orgName;

  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
              private formBuilder: FormBuilder,
              public kumulosService: KumulosService, 
              public dialog: MatDialog) 
  {
    this.initMemberVariables();
    this.unpackInjectedData(data);
    this.initAddCompanyForm();
    this.setCompanyFormListener();
  }

  private initMemberVariables(): void
  {
    this.userMadeChangesFlag = false; 
  }

  private unpackInjectedData(data: any): void
  {
    this.orgName = data.orgName;
  }

  private initAddCompanyForm(): void 
  {
    this.addCompanyForm = this.formBuilder.group({
      name: [''],
      license: [''],
      maxUsers: [''],
      validFrom: [''],
      validTo: [''],
     });
  }

  private setCompanyFormListener(){
    this.addCompanyForm.valueChanges.subscribe(data => {
      this.userMadeChangesFlag = true;
   });
  }

  public addCompany(): void {
    this.httpRequestFlag = true;
    this.kumulosService.webCreateUpdateSurveys(this.orgName, this.addCompanyForm.value, null, null).subscribe(responseJSON => {
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

    console.log("LICENSE TYPE!");
    console.log(this.company.licenseType);

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

    let archiveFlag: boolean = this.editCompanyForm.value.archive;

    if (this.editCompanyForm.value.archive == "")
      archiveFlag = false;
    else
    {
      console.log("THERES SOMETHING THERE");
      console.log(this.editCompanyForm.value.archive);
    }

    console.log("ARCHIVE FLAG");
    console.log(this.editCompanyForm.value.archive);

    this.kumulosService.webCreateUpdateSurveys(this.orgName, this.editCompanyForm.value, this.company.cityID, archiveFlag).subscribe(responseJSON => {
      console.log(responseJSON);
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