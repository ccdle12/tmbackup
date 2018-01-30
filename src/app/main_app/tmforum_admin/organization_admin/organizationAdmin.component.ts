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
    // let customerTypes = this.organizationsJSON[index].customerTypes;
    let headquartersLocation = this.organizationsJSON[index].headquartersLocation;
    let operatingTime = this.organizationsJSON[index].operatingTime;
    // let primaryProductsAndServices = this.organizationsJSON[index].primaryProductsAndServices;
    // let sectors = this.organizationsJSON[index].sectors;

    /**
     * Unpacking the regions multi select
     * MULTI-SELECT 1.
     */
    let regions = this.organizationsJSON[index].regions.split(/\|/g);
    let primaryProductsAndServices = this.organizationsJSON[index].primaryProductsAndServices.split(/\|/g);
    let sectors = this.organizationsJSON[index].sectors.split(/\|/g)
    let customerTypes = this.organizationsJSON[index].customerTypes.split(/\|/g)

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

  /**
   * MULTI-SELECT 2. 
   *
   * /

  /**
   * Variables needed for region multi-select
   */
  public regionsFormControl = new FormControl();
  public regionsList;
  
  /**
   * Variables needed for primaryProductsAndServices multi-select
   */
  public primaryProductsAndServicesFormControl = new FormControl();
  public primaryProductsAndServicesList;

  /**
   * Variables needed for sectors multi-select
   */
  public sectorsFormControl = new FormControl();
  public sectorsList;

  /**
   * Variables needed for customer types multi-select
   */
  public customerTypesFormControl = new FormControl();
  public customerTypesList;

  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(public dialog: MatDialog, 
              private formBuilder: FormBuilder, 
              public kumulosService: KumulosService, 
              public renderer: Renderer, 
              private ngZone: NgZone) {
    
    this.initMemberVariables();
    
    /**
     * MULTI-SELECT 3.
     */
    this.inviteOrganizationForm = this.formBuilder.group({
     organizationName: [''],
     contactName: [''],
     email: ['', [Validators.required, ValidationService.emailValidator]],
     primaryProductsAndServices: [this.primaryProductsAndServicesFormControl],
     regions: [this.regionsFormControl],
     sectors: [this.sectorsFormControl],
     customerTypes: [this.customerTypesFormControl],
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

  /**
   * MULTI-SELECT 4.
   */
  public initMemberVariables(): void {
    this.regionsList = ['North America', 'Latin/America/Caribbean', 'Europe and/or Russia', 'Middle East and/or Africa', 'Asia/Pacific', 'Global'];
    this.primaryProductsAndServicesList = ['Fixed Operator', 'Mobile Operator', 'Converged Operator (some combination of mobile, fixed voice and data, and TV)', 'Cable operator', 'Digital services provider (e.g. IoT, smart cities)', 'other'];
    this.sectorsList = ['Aerospace industry', 'Agriculture industry', 'Chemical industry', 'Pharmaceutical industry', 'Computer industry', 'Software industry', 'Construction industry', 'Defense industry', 'Education industry', 'Energy industry', 'Entertainment industry', 'Financial services industry', 'Food industry', 'Health care industry', 'Hospitality industry', 'Information industry', 'Manufacturing', 'Mass media', 'Telecommunications industry', 'Transport industry', 'Water industry', 'All of the above', 'Other'];
    this.customerTypesList = ['Business', 'SME', 'Consumer', 'Wholesale']
  }

  public addNewOrganization(): void {
    let organizationName: string = this.inviteOrganizationForm.value.organizationName;
    let contactName: string = this.inviteOrganizationForm.value.contactName;
    let email: string = this.inviteOrganizationForm.value.email;

    this.httpRequestFlag = true;

    /**
     * MULTI-SELECT 5.
     */
    /**
     * Taking selected regions and converting to string
     * Update html 
     * Put null checks on form controls
     */

    if (this.primaryProductsAndServicesFormControl.value != null) {
      let primaryProductsAndServicesAsString = this.multiSelectAdd(this.primaryProductsAndServicesFormControl)
      this.inviteOrganizationForm.value.primaryProductsAndServices = primaryProductsAndServicesAsString
    } else {
      this.inviteOrganizationForm.value.primaryProductsAndServices = ""
    }

    if (this.regionsFormControl.value != null) {
      let regionsAsString = this.multiSelectAdd(this.regionsFormControl)
      this.inviteOrganizationForm.value.regions = regionsAsString
      console.log(regionsAsString)
    } else {
      this.inviteOrganizationForm.value.regions = ""
    }

    if (this.sectorsFormControl.value != null) {
      // console.log(this.sectorsFormControl)
      let sectorsAsString = this.multiSelectAdd(this.sectorsFormControl)
      this.inviteOrganizationForm.value.sectors = sectorsAsString
    } else {
      this.inviteOrganizationForm.value.sectors = ""
    }

    if (this.customerTypesFormControl.value != null) {
      // console.log(this.customerTypesFormControl)
      let customerTypesAsString = this.multiSelectAdd(this.customerTypesFormControl)
      this.inviteOrganizationForm.value.customerTypes = customerTypesAsString
      console.log(customerTypesAsString)
    } else {
      this.inviteOrganizationForm.value.customerTypes = ""
    }

    this.kumulosService.webCreateUpdateOrganizations(organizationName, contactName, email, false, null, this.inviteOrganizationForm).subscribe(responseJSON => {
        console.log("Response");
        console.log(responseJSON);
      this.dialog.closeAll();
    })
  }

  /**
   * Pack multi-select options into a string separated by pipes "|"
   * @param formControl 
   */
  public multiSelectAdd(formControl): string {
    let stringDataToSend = "";
    let selectedItems = formControl.value;

    for (let i = 0; i < selectedItems.length; i++)
    {
      if (i != selectedItems.length - 1)
        stringDataToSend += selectedItems[i] + "|";
      else
        stringDataToSend += selectedItems[i];
    }

    return stringDataToSend
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

  /**
   * MULTI-SELECT 6.
   */
  /**
   * Variables needed for regions multi select
   */
  public regionsFormControl = new FormControl();
  public regionsList;
  public resultLocation;

  /**
   * Variables needed for regions multi select
   */
  public primaryProductsAndServicesFormControl = new FormControl();
  public primaryProductsAndServicesList;
  public primaryProductsAndServicesSelected;

  /**
   * Variables needed for sectors multi select
   */
  public sectorsFormControl = new FormControl();
  public sectorsList;
  public sectorsSelected;

  /**
   * Variables needed for customers multi select
   */
  public customersFormControl = new FormControl();
  public customersList;
  public customersSelected;
  
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
    this.userMadeChangesFlag = true; 

     /**
      * MULTI-SELECT 7.
      */
    /**
     * Multiple options for multi-select regions
     */
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

    this.primaryProductsAndServicesList = 
    [
      {
        id: "FO",
        value: 'Fixed Operator',
      },
      {
        id: "MO",
        value: 'Mobile Operator',
      },
      {
        id: "CO",
        value: 'Converged Operator (some combination of mobile, fixed voice and data, and TV)'
      },
      {
        id: "CO2",
        value: 'Cable operator'
      },
      {
        id: "DS",
        value: 'Digital services provider (e.g. IoT, smart cities)'
      },
      {
        id: "other",
        value: "other"
      }
    ]

    this.sectorsList = 
    [
      {
        id: "Aerospace industry",
        value: 'Aerospace industry',
      },
      {
        id: "Agriculture industry",
        value: 'Agriculture industry',
      },
      {
        id: "Chemical industry",
        value: 'Chemical industry'
      },
      {
        id: "Pharmaceutical industry",
        value: 'Pharmaceutical industry'
      },
      {
        id: "Computer industry",
        value: 'Computer industry'
      },
      {
        id: "Software industry",
        value: "Software industry"
      },
      {
        id: "Construction industry",
        value: "Construction industry"
      },
      {
        id: "Defense industry",
        value: "Defense industry"
      },
      {
        id: "Education industry",
        value: "Education industry"
      },
      {
        id: "Energy industry",
        value: "Energy industry"
      },
      {
        id: "Entertainment industry",
        value: "Entertainment industry"
      },
      {
        id: "Financial services industry",
        value: "Financial services industry"
      },
      {
        id: "Food industry",
        value: "Food industry"
      },
      {
        id: "Health care industry",
        value: "Health care industry"
      },
      {
        id: "Hospitality industry",
        value: "Hospitality industry"
      },
      {
        id: "Information industry",
        value: "Information industry"
      },
      {
        id: "Manufacturing",
        value: "Manufacturing"
      },
      {
        id: "Mass media",
        value: "Mass media"
      },
      {
        id: "Telecommunications industry",
        value: "Telecommunications industry"
      },
      {
        id: "Transport industry",
        value: "Transport industry"
      },
      {
        id: "Water industry",
        value: "Water industry"
      },
      {
        id: "All of the above",
        value: "All of the above"
      },
      {
        id: "Other",
        value: "Other"
      },
    ]

    this.customersList = 
    [
      {
      id: "Business",
      value: 'Business', 
      },
      {
      id: "SME",
      value: 'SME', 
      },
      {
      id: "Consumer",
      value: 'Consumer', 
      },
      {
      id: "Wholesale",
      value: 'Wholesale', 
      },
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
    console.log(this.primaryProductsAndServices)
    this.regions = data.regions;
    this.sectors = data.sectors;
    this.totalEmployees = data.totalEmployees;
    this.totalAnnualRevenue = data.totalAnnualRevenue;


     /**
      * MULTI-SELECT 8.
      */
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

    this.primaryProductsAndServicesSelected = [];
    for (let i = 0; i < this.primaryProductsAndServices.length; i++)
      for (let j = 0; j < this.primaryProductsAndServicesList.length; j++)
      {
        if (this.primaryProductsAndServices[i] == this.primaryProductsAndServicesList[j].value)
        {
          var primaryProductsToToggle = this.primaryProductsAndServicesList[j];
          this.primaryProductsAndServicesSelected.push(primaryProductsToToggle);
        }
      }

      this.sectorsSelected = [];
      for (let i = 0; i < this.sectors.length; i++)
        for (let j = 0; j < this.sectorsList.length; j++)
        {
          if (this.sectors[i] == this.sectorsList[j].value)
          {
            var sectorsToToggle = this.sectorsList[j];
            this.sectorsSelected.push(sectorsToToggle);
          }
        }

      this.customersSelected = [];
      for (let i = 0; i < this.customerTypes.length; i++)
        for (let j = 0; j < this.customersList.length; j++)
        {
          if (this.customerTypes[i] == this.customersList[j].value)
          {
            var customersToToggle = this.customersList[j];
            this.customersSelected.push(customersToToggle);
          }
        }
 
  }

     /**
      * MULTI-SELECT 9.
      * Change to formControl
      */
  private initEditOrganizationForm(): void 
  {
    this.editOrganizationForm = this.formBuilder.group({
      organizationName: [this.organizationName],
      contactName: [this.contactName],
      email: [this.contactEmail, [Validators.required, ValidationService.emailValidator]],
      archive: [''],
      primaryProductsAndServices: [this.primaryProductsAndServicesFormControl],
      regions: [this.regionsFormControl],
      sectors: [this.sectorsFormControl],
      customerTypes: [this.customersFormControl],
      totalEmployees: [this.totalEmployees],
      totalAnnualRevenue: [this.totalAnnualRevenue],
      operatingTime: [this.operatingTime],
      headquartersLocation: [""],
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
      * MULTI-SELECT 10.
      * Pack multi select into string separated by pipes
      */
    let regionsToSend = this.multiSelectAdd(this.regionsFormControl)
    this.editOrganizationForm.value.regions = regionsToSend;

    let primaryProductsAndServicesToSend = this.multiSelectAdd(this.primaryProductsAndServicesFormControl)
    this.editOrganizationForm.value.primaryProductsAndServices = primaryProductsAndServicesToSend

    let sectorsToSend = this.multiSelectAdd(this.sectorsFormControl)
    this.editOrganizationForm.value.sectors = sectorsToSend

    let customersTypesToSend = this.multiSelectAdd(this.customersFormControl)
    this.editOrganizationForm.value.customerTypes = customersTypesToSend


    this.httpRequestFlag = true;
    this.kumulosService.webCreateUpdateOrganizations(organizationName, contactName, email, archiveFlag, this.orgID, this.editOrganizationForm).subscribe(responseJSON => {
      this.dialog.closeAll();
    })
  }

   /**
   * Pack multi-select options into a string separated by pipes "|"
   * @param formControl 
   */
  public multiSelectAdd(formControl): string {
    let stringDataToSend = "";
    let selectedItems = formControl.value;

    for (let i = 0; i < selectedItems.length; i++)
    {
      if (i != selectedItems.length - 1)
        stringDataToSend += selectedItems[i].value + "|";
      else
        stringDataToSend += selectedItems[i].value;
    }

    return stringDataToSend
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