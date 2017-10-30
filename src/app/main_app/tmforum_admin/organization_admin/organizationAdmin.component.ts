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
  selector: 'organizationAdminComponent',
  templateUrl: './organizationAdmin.component.html',
  styleUrls: ['./organizationAdmin.component.css']
})
export class OrganizationAdminComponent {

    public backToDashboardTooltip;
    public organizationsJSON;

    constructor(public router: Router, public kumulosService: KumulosService, public dialog: MatDialog,
                public loadingSnackBar: LoadingSnackBar) {
      this.webGetOrganizations();
      this.initializeMemberVariables();    
    
    }

    /* kumulos call */
    private webGetOrganizations() {
      this.loadingSnackBar.showLoadingSnackBar();
      this.kumulosService.webGetOrganizations().subscribe(response => {
        this.organizationsJSON = response.payload;
        this.loadingSnackBar.dismissLoadingSnackBar();
      });
    }

    private initializeMemberVariables(): void {
      this.backToDashboardTooltip = "Back To Dashboard";
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
      case('surveyadmin'):
        this.router.navigateByUrl('/main/tmforumadmin/surveyadmin');
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


  /* methods called from view */
  public addNewOrganization(): void 
  {
    let dialogRef = this.dialog.open(AddNewOrgDialog);

    dialogRef.afterClosed().subscribe(result => {
        this.webGetOrganizations();
    });
  }

  public editOrganization(index: number): void
  {
    let contactEmail = this.organizationsJSON[index].contactEmail;
    let contactName = this.organizationsJSON[index].contactName;
    let orgID = this.organizationsJSON[index].organizationID;
    let organizationName = this.organizationsJSON[index].organizationName;

    let dialogRef = this.dialog.open(EditOrgDialog, {
      data: {
              contactName: contactName,
              contactEmail: contactEmail,
              orgID: orgID,
              organizationName: organizationName
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.webGetOrganizations();
    });
  }

}

@Component({
  selector: 'addNewOrgDialog',
  templateUrl: './add_new_org_dialog/addNewOrgDialog.html',
  styleUrls: ['./add_new_org_dialog/addNewOrgDialog.css']
})
export class AddNewOrgDialog {

  httpRequestFlag: boolean;
  inviteOrganizationForm: FormGroup;
  
  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, public kumulosService: KumulosService, 
              public renderer: Renderer, private ngZone: NgZone) {
    
    this.inviteOrganizationForm = this.formBuilder.group({
     organizationName: [''],
     contactName: [''],
     email: ['', [Validators.required, ValidationService.emailValidator]],
    });
  }

  public addNewOrganization(): void {
    let organizationName: string = this.inviteOrganizationForm.value.organizationName;
    let contactName: string = this.inviteOrganizationForm.value.contactName;
    let email: string = this.inviteOrganizationForm.value.email;

    this.httpRequestFlag = true;
    this.kumulosService.webCreateUpdateOrganizations(organizationName, contactName, email, false, null).subscribe(responseJSON => {
      this.dialog.closeAll();
    })
  }

  onSubmit() {}
}

@Component({
  selector: 'editOrgDialog',
  templateUrl: './edit_org_dialog/editOrgDialog.html',
  styleUrls: ['./edit_org_dialog/editOrgDialog.css']
})
export class EditOrgDialog {

  public httpRequestFlag: boolean;

  public contactEmail;
  public contactName;
  public organizationName;
  private orgID;

  public userMadeChangesFlag;
  public editOrganizationForm: FormGroup;

  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
              private formBuilder: FormBuilder,
              public kumulosService: KumulosService, 
              public dialog: MatDialog) 
  {
    this.initMemberVariables();
    this.unpackInjectedData(data);
    this.initEditOrganizationForm();
    this.setOrganizationFormListener();
  }

  private initMemberVariables(): void
  {
    this.userMadeChangesFlag = false; 
  }

  private unpackInjectedData(data: any): void
  {
    this.contactEmail = data.contactEmail;
    this.contactName = data.contactName;
    this.organizationName = data.organizationName;
    this.orgID = data.orgID;
  }

  private initEditOrganizationForm(): void 
  {
    this.editOrganizationForm = this.formBuilder.group({
      organizationName: [this.organizationName],
      contactName: [this.contactName],
      email: [this.contactEmail, [Validators.required, ValidationService.emailValidator]],
     });
  }

  private setOrganizationFormListener()
  {
    this.editOrganizationForm.valueChanges.subscribe(data => {
      this.userMadeChangesFlag = true;
      console.log("Values changed listener has picked this up");
      console.log("user made changes: " + this.userMadeChangesFlag);
   });
  }

  public editOrganization(): void {
    let organizationName: string = this.editOrganizationForm.value.organizationName;
    let contactName: string = this.editOrganizationForm.value.contactName;
    let email: string = this.editOrganizationForm.value.email;
    
    this.httpRequestFlag = true;
    this.kumulosService.webCreateUpdateOrganizations(organizationName, contactName, email, false, this.orgID).subscribe(responseJSON => {
      this.dialog.closeAll();
    })
  }

  public enableSubmitButton(): boolean 
  {
    let submitButtonState: boolean = true;

    if (this.userMadeChangesFlag && this.editOrganizationForm.valid)
      submitButtonState = false;

    return submitButtonState;
  }

  onSubmit() {}
}