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
  selector: 'bulkInviteAdminComponent',
  templateUrl: './bulkInviteAdmin.component.html',
  styleUrls: ['./bulkInviteAdmin.component.css']
})
export class BulkInviteAdminComponent {

    public backToDashboardTooltip;
    public organizations: Array<any>;
    public currentOrganizationSelected: any;
    public currentCitySelected: any;
    public currentCitySelectedName: any;
    private organizationAndCompanyPairs;
    private companyNameAndJsonPairs;

    public companiesInView: Array<any>;
    public bulkEmails: String;
    public splitBulkEmails: Array<any>;

    invalidEmailsFlag: boolean;
    regexEmailFailedCache: Array<any>;

    constructor(public router: Router, public kumulosService: KumulosService, public dialog: MatDialog,
                public loadingSnackBar: LoadingSnackBar) {
      this.initializeMemberVariables();  
      this.getAllOrganizationsAndCompanies();
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
        this.loadingSnackBar.dismissLoadingSnackBar();
      }
    });
  }

  private getCompaniesFromOrganizations() {

    this.organizations.forEach(element => {

      this.kumulosService.webGetSurveysByOrg(element.value.name).subscribe(response => {
        this.organizationAndCompanyPairs.set(element.value.name, response.payload);
        
        this.currentOrganizationSelected = this.organizations[0].value;

        let currentOrg = this.organizationAndCompanyPairs.get(this.currentOrganizationSelected.name);
        let firstCompany = currentOrg[0];
        this.currentCitySelected = firstCompany;
        this.currentCitySelectedName = this.currentCitySelected.name; 

        currentOrg.forEach(element => {
          this.companyNameAndJsonPairs.set(element.name, element);
        });

        this.loadingSnackBar.dismissLoadingSnackBar();

        this.updateCompaniesInView();
      });
    });
  }

  private updateCompaniesInView(): void {
    let retrievedListOfCompanies = this.organizationAndCompanyPairs.get(this.currentOrganizationSelected.name);
    let firstCompany = retrievedListOfCompanies[0];
    this.currentCitySelected = firstCompany;

    this.companiesInView = [];

    retrievedListOfCompanies.forEach(eachCompany => {
      let companyName = eachCompany.name;
      
      this.companiesInView.push({label: companyName, value: {id:companyName, name:companyName}});  
    });
  }



  /** Setup and initialization method **/
  private initializeMemberVariables(): void {
    this.backToDashboardTooltip = "Back To Dashboard";
    this.organizations = new Array();
    this.organizationAndCompanyPairs = new Map<string, JSON[]>();
    this.companyNameAndJsonPairs = new Map<string, JSON[]>();
    this.companiesInView = new Array();
    this.invalidEmailsFlag = true;
  }



  /** Methods called from the view  **/
  public backToDashboard(): void {
    this.router.navigateByUrl('/main/takesurvey');
  }

  public bulkEmailsEntered(): boolean
  {
      return (this.bulkEmails == null || this.bulkEmails.length == 0);
  }

  public sendBulkEmails()
  {
      this.splitBulkEmails = this.bulkEmails.split(";");

          this.checkEmailsValid();

          if (this.invalidEmailsFlag)
          {
              this.sendEmailsToKumulos();
              this.clearBulkEmails();
          }
          else
          {                
              // this.launchInvalidEmailsDialog();
          }
  }

  private checkEmailsValid(): void
  {
      for (let i = 0; i < this.splitBulkEmails.length; i++)
      {
          this.splitBulkEmails[i] = this.splitBulkEmails[i].trim();

          if (this.splitBulkEmails[i] == "")
              continue;
          

          if (!this.splitBulkEmails[i].match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/))
          {   
              this.regexEmailFailedCache.push(this.splitBulkEmails[i]);
              this.invalidEmailsFlag = false;
          }
      }
  }

  private sendEmailsToKumulos()
  {
      this.loadingSnackBar.showLoadingSnackBar();

      let formattedEmails: string = this.formatBulkEmails();

      let currentCityJson = this.companyNameAndJsonPairs.get(this.currentCitySelectedName.name);

      let city = currentCityJson.city;
      let cityID = currentCityJson.cityID;

      this.kumulosService.webBulkInviteUser(formattedEmails, city, cityID).subscribe(response => {
          this.loadingSnackBar.dismissLoadingSnackBar();
      });
  }

  private formatBulkEmails(): string
  {
      let formattedEmailsArray = new Array();

      for (let i = 0; i < this.splitBulkEmails.length; i++)
      {
          if (this.splitBulkEmails[i].length > 0)
          {
              let emailKV = "{" + '"email"' + ":" + " " + '"' + this.splitBulkEmails[i] + '"' + "}";
              formattedEmailsArray.push(emailKV);
          }
      }

      let result: string = '{"emailAddresses":' + "[" + formattedEmailsArray.toString() + ']' + '}'; 

      return result; 
  }

  private clearBulkEmails(): void
  {
      this.splitBulkEmails = [];
  }

  /* Nav Bar Routing */
  public routeToPage(surveyPage: String) 
  {
    switch(surveyPage) 
    {
      case ('surveyadmin'):
        this.router.navigateByUrl('main/tmforumadmin/surveyadmin');
        break;

      case ('useradmin'):
        this.router.navigateByUrl('main/tmforumadmin/useradmin');
        break;
        
      case ('benchmarkdata'):
        this.router.navigateByUrl('main/tmforumadmin/benchmarkdata');
        break;

      case ('organizationadmin'):
        this.router.navigateByUrl('main/tmforumadmin/organizationadmin');
        break;

      case('publisheddataadmin'):
        this.router.navigateByUrl('main/tmforumadmin/publisheddataadmin');
        break;
      }
    }

/* Methods called from view */
public organizationHasChanged(): void {
  this.updateCompaniesInView();

}

public cityHasChanged(): void {

}

}