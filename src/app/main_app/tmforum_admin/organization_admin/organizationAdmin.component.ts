import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog, MatTooltip, MatSnackBar, MAT_DIALOG_DATA, MatOption } from '@angular/material';
import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {NgZone, Renderer, ElementRef, ViewChild} from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { forEach } from '@angular/router/src/utils/collection';

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
        console.log(this.organizationsJSON);
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
          // console.log("returning blue background?");
          return { 'background-color': '#469ac0',
                'color': 'white' };    
      } else {
      // console.log(window.location.pathname);
      return { 'background-color': '#62B3D1',
                'color': 'white' };
      }
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


  /* methods called from view */
  public addNewOrganization(): void 
  {
    let dialogRef = this.dialog.open(AddNewOrgDialog, {
      height: '400px',
      width: '600px',
    });

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
    let customerTypes = this.organizationsJSON[index].customerTypes;
    let headquartersLocation = this.organizationsJSON[index].headquartersLocation;
    let operatingTime = this.organizationsJSON[index].operatingTime;
    let primaryProductsAndServices = this.organizationsJSON[index].primaryProductsAndServices;

    console.log("REGIONS");
    console.log(this.organizationsJSON[index].regions.split(/\|/g));
    // SPlitting string into array to send to edit dialog
    let regions = this.organizationsJSON[index].regions.split(/\|/g);

    let sectors = this.organizationsJSON[index].sectors;
    let totalEmployees = this.organizationsJSON[index].totalEmployees;
    let totalAnnualRevenue = this.organizationsJSON[index].totalAnnualRevenue;


    let dialogRef = this.dialog.open(EditOrgDialog, {
      height: '400px',
      width: '600px',
      data: {
              contactName: contactName,
              contactEmail: contactEmail,
              orgID: orgID,
              organizationName: organizationName,
              customerTypes: customerTypes,
              headquartersLocation: headquartersLocation,
              operatingTime: operatingTime,
              primaryProductsAndServices: primaryProductsAndServices,
              regions: regions,
              sectors: sectors,
              totalAnnualRevenue: totalAnnualRevenue,
              totalEmployees: totalEmployees,
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

  public regionsFormControl = new FormControl();
  public regionsList;
  
  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, public kumulosService: KumulosService, 
              public renderer: Renderer, private ngZone: NgZone) {
    
    this.initMemberVariables();
    
    this.inviteOrganizationForm = this.formBuilder.group({
     organizationName: [''],
     contactName: [''],
     email: ['', [Validators.required, ValidationService.emailValidator]],
     primaryProductsAndServices: [''],
     regions: [''],
     sectors: [''],
     customerTypes: [''],
     totalEmployees: [''],
     totalAnnualRevenue: [''],
     operatingTime: [''],
     headquartersLocation: [''],
    //  transformation: [''],
    //  personalInvolvment: [''],
    //  personalAssociation: [''],
    //  businessFunction: [''],
    //  levelOfManagement: [''],
    //  productLine: [''],
    });
  }

  public initMemberVariables(): void {
    this.regionsList = ['North America', 'Latin/America/Caribbean', 'Europe and/or Russia', 'Middle East and/or Africa', 'Asia/Pacific', 'Global'];
  }

  public addNewOrganization(): void {
    let organizationName: string = this.inviteOrganizationForm.value.organizationName;
    let contactName: string = this.inviteOrganizationForm.value.contactName;
    let email: string = this.inviteOrganizationForm.value.email;

    this.httpRequestFlag = true;
    this.inviteOrganizationForm.value.region = String(this.regionsFormControl.value);
    console.log(this.inviteOrganizationForm.value.region);
    this.kumulosService.webCreateUpdateOrganizations(organizationName, contactName, email, false, null, this.inviteOrganizationForm).subscribe(responseJSON => {
        console.log("Response");
        console.log(responseJSON);
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

  customerTypes;
  headquartersLocation;
  operatingTime;
  primaryProductsAndServices;
  regions;
  sectors;
  totalEmployees;
  totalAnnualRevenue;

  public userMadeChangesFlag;
  public editOrganizationForm: FormGroup;

  public regionsFormControl = new FormControl();
  public regionsList;
  public resultLocation;
  
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
    this.regionsList = 
    [
      {
      id: "NA",
      value: 'North America', 
      },
      {
      id: "LA",
      value: 'Latin/America/Caribbean', 
      },
      {
      id: "EU",
      value: 'Europe and/or Russia', 
      },
      {
      id: "MEORAFR",
      value: 'Middle East and/or Africa', 
      },
      {
      id: "AP",
      value: 'Asia/Pacific', 
      },
      {
      id: "GL",  
      value: 'Global'
      }
    ];
  }

  private unpackInjectedData(data: any): void
  {
    this.contactEmail = data.contactEmail;
    this.contactName = data.contactName;
    this.organizationName = data.organizationName;
    this.orgID = data.orgID;

    this.organizationName =  data.organizationName;
    this.customerTypes = data.customerTypes;
    this.headquartersLocation = data.headquartersLocation;
    this.operatingTime = data.operatingTime;
    this.primaryProductsAndServices = data.primaryProductsAndServices;
    this.regions = data.regions;
    this.sectors = data.sectors;
    this.totalEmployees = data.totalEmployees;
    this.totalAnnualRevenue = data.totalAnnualRevenue;


    /**
     * Unpack selected regions and show them on the view as selected
     */
    this.resultLocation = [];
    for (let i = 0; i < this.regions.length; i++)
      for (let j = 0; j < this.regionsList.length; j++)
      {
        if (this.regions[i] == this.regionsList[j].value)
        {
          var regionToToggle = this.regionsList[j];
          this.resultLocation.push(regionToToggle);
        }
      }    
  }

  private initEditOrganizationForm(): void 
  {
    this.editOrganizationForm = this.formBuilder.group({
      organizationName: [this.organizationName],
      contactName: [this.contactName],
      email: [this.contactEmail, [Validators.required, ValidationService.emailValidator]],
      archive: [''],
      primaryProductsAndServices: [this.primaryProductsAndServices],
      regions: [this.regionsFormControl],
      sectors: [this.sectors],
      customerTypes: [this.customerTypes],
      totalEmployees: [this.totalEmployees],
      totalAnnualRevenue: [this.totalAnnualRevenue],
      operatingTime: [this.operatingTime],
      headquartersLocation: [this.headquartersLocation],
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
    let archiveFlag: boolean = this.editOrganizationForm.value.archive;

    /**
     * Taking selected regions and converting to string
     */
    let regionsToSend = "";
    let selectedRegions = this.editOrganizationForm.value.regions.value;
    for (let i = 0; i < selectedRegions.length; i++)
    {
      if (i != selectedRegions.length - 1)
        regionsToSend += selectedRegions[i].value + "|";
      else
        regionsToSend += selectedRegions[i].value;
    }
    
    this.editOrganizationForm.value.regions = regionsToSend;

    console.log(this.editOrganizationForm.value.regions);

    this.httpRequestFlag = true;
    console.log(this.orgID);
    this.kumulosService.webCreateUpdateOrganizations(organizationName, contactName, email, archiveFlag, this.orgID, this.editOrganizationForm).subscribe(responseJSON => {
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