import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog, MatTooltip, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgZone, Renderer, ElementRef, ViewChild} from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { InviteUserDialog } from 'app/main_app/team_admin/teamAdmin.component';
import { ElementSchemaRegistry } from '@angular/compiler';
import { StylingService } from '../../../shared/services/styling.service';

@Component({
  selector: 'userAdminComponent',
  templateUrl: './userAdmin.component.html',
  styleUrls: ['./userAdmin.component.css']
})
export class UserAdminComponent {

  public backToDashboardTooltip: string;
  public getUserEmails: string;
  public loadingFlag: boolean;

  /**
   * Variables bound to the view
   */
  public organizationsInView: Array<any>;
  public surveyGroupsInView: Array<any>;
  public currentOrganizationSelected: any;
  public httpRequestFlag: boolean;

  //Recording id position?
  public currentSurveyGroupSelected: any;
  public usersInView: Array<any>;


  // public surveyGroups: Array<any>; // Is this being used?
  public organizationAndSurveyGroupPairs: Map<string, JSON[]>;
  public surveyGroupAndUserPairs: Map<string, JSON[]>;
  public surveyGroupNameAndObjectDetails: Map<string, JSON[]>;
  public organizationAndIdDict: Map<any, any>;
  public surveyGroupAndIdDict: Map<any, any>;


  // Survey counter
  public surveyCounter = 0;
  public surveyLengths = 0;


  constructor(public router: Router, 
              public kumulosService: KumulosService, 
              public dialog: MatDialog,
              public loadingSnackBar: LoadingSnackBar,
              public stylingService: StylingService) 
  {
    this.initMemberVariables(); 
    this.getAllOrganizationsAndSurveyGroups();
  }

  public navStyle()
  {
    return {'background-color': this.stylingService.getPrimaryColour('grey')}
  }

  public userAdminStyle()
  {
    return { 'background-color': this.stylingService.getPrimaryColour('red'),
    'color': 'white' };    
  }

  private initMemberVariables(): void {
    this.backToDashboardTooltip = "Back To Dashboard";
    this.getUserEmails = "Get All Users Emails";

    this.loadingFlag = true;

    this.organizationsInView = new Array();
    this.surveyGroupsInView = new Array();
    this.usersInView = new Array();

    this.organizationAndSurveyGroupPairs = new Map<string, JSON[]>();
    this.surveyGroupAndUserPairs = new Map<string, JSON[]>();
    this.surveyGroupNameAndObjectDetails = new Map<string, JSON[]>();
    this.organizationAndIdDict = new Map<any, any>();
    this.surveyGroupAndIdDict = new Map<any, any>();
  }



  /* Kumulos call */
  /* Get all organizationsInViewInView and surveyGroups */
  private getAllOrganizationsAndSurveyGroups() {
    this.webGetOrganizations();
  }

  private webGetOrganizations() {
    this.loadingSnackBar.showLoadingSnackBar();

      this.kumulosService.webGetOrganizations().toPromise()
        .then(res => {
            res.payload.map(item => {
              this.organizationsInView.push({label: item.organizationName, value: {id: item.organizationName, name: item.organizationName}});
            });

            for (let i = 0; i < res.payload.length; i++)
              this.organizationAndIdDict.set(this.organizationsInView[i].value, i);
            
            if (!this.currentOrganizationSelected)
              this.currentOrganizationSelected = this.organizationsInView[0].value;
            else 
            {
              let id = this.organizationAndIdDict.get(this.currentOrganizationSelected);
              this.currentOrganizationSelected = this.organizationsInView[id].value;
            }
            
          }
        )
        .catch(res => ("there was an error"))
        .then(res => {
          /**
           * USER ADMIN 2.0: Only get Survey Groups for the first item 
           * OR if there is a currently selected org
           */
            if (this.currentOrganizationSelected)
              this.reqSurveyGroups(this.currentOrganizationSelected.id)
            else 
            {
              let firstOrgName = this.organizationsInView[0].value.name
              this.reqSurveyGroups(firstOrgName);
            }
        })
}

private reqSurveyGroups(orgName: string) {
  return this.kumulosService.webGetSurveysByOrg(orgName).toPromise()
    .then(res => { 
      this.organizationAndSurveyGroupPairs.set(orgName, res.payload);
      
      /**
       * Continues to Load until all users are loaded and cached
       */
      this.surveyLengths += res.payload.length

      return res.payload;
    })
    .catch(res => ("There as an error"))
    .then(res => {
      this.setInitialSurveyGroupsInView();
      return res;
    }).then(res => {
      res.forEach(element => {
        /**
         * a. Creating Map, pairing survey group name and its JSON object
         * b. Requesting users according to each survey group
         */
        this.surveyGroupNameAndObjectDetails.set(element.name, element);
        this.reqUsersFromSurveyGroup(element["name"], element["cityID"]);
      });
    })
};

private reqUsersFromSurveyGroup(surveyGroupName: string, cityID: string) {
  this.kumulosService.getWebUsersCityIdOverload(cityID).toPromise()
    .then(res => {

      this.surveyGroupAndUserPairs.set(surveyGroupName, res.payload);
    })
    .catch()
    .then(res => {

      let listOfUsers;

      if (this.currentSurveyGroupSelected)
        listOfUsers = this.surveyGroupAndUserPairs.get(this.currentSurveyGroupSelected.name);

      
      this.usersInView = [];
      
      if (listOfUsers) {
        listOfUsers.forEach(element => {
            this.usersInView.push(listOfUsers);
          });
      }

      if (this.usersInView[0])
        this.usersInView = this.usersInView[0];

      /**
       * Continues to Load until all users are loaded and cached
       */
      this.surveyCounter += 1
      if (this.surveyCounter >= this.surveyLengths) {
        this.loadingSnackBar.dismissLoadingSnackBar()
        this.loadingFlag = false;
      }
    })
}

private setInitialSurveyGroupsInView(){
  let listOfCurrentSurveyGroups = this.organizationAndSurveyGroupPairs.get(this.currentOrganizationSelected.name);
  
  this.surveyGroupsInView = [];

  if (listOfCurrentSurveyGroups) {
    listOfCurrentSurveyGroups.forEach(item => {
      this.surveyGroupsInView.push({label: item["name"], value: {id: item["name"], name: item["name"]}});
    });

    for (let i = 0; i < this.surveyGroupsInView.length; i++)
    {
      this.surveyGroupAndIdDict.set(this.surveyGroupsInView[i].value.id, i);
    }

    if (!this.currentSurveyGroupSelected)
    {
      if (this.surveyGroupsInView[0]) {
        this.currentSurveyGroupSelected = this.surveyGroupsInView[0].value;
      }
    }
    else
    {
      let listOfSurveyGroupsInCurrentOrg = this.organizationAndSurveyGroupPairs.get(this.currentOrganizationSelected.id)

      listOfSurveyGroupsInCurrentOrg.forEach(survey => {
        if (survey["name"] == this.currentOrganizationSelected.id)
        {
            this.currentSurveyGroupSelected = this.surveyGroupsInView[0].value
        }
        else 
        {
           // If there isn't a current survey group selected, we will use the first one in the survey group
          let id = this.surveyGroupAndIdDict.get(this.currentSurveyGroupSelected.id);

          if (this.surveyGroupsInView.length > 0)
            this.currentSurveyGroupSelected = this.surveyGroupsInView[id].value;
        }    
      })
    }
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




/* *
 * Callback methods from the view 
 */
public surveyGroupHasChanged(): void {
   this.usersInView = []

  if (this.currentSurveyGroupSelected)
    this.usersInView = this.surveyGroupAndUserPairs.get(this.currentSurveyGroupSelected.name);
}

public organizationHasChanged(): void {
  this.loadingSnackBar.showLoadingSnackBar();
  this.surveyGroupsInView = [];
  this.usersInView = [];

  let listOfSurveyGroups = this.organizationAndSurveyGroupPairs.get(this.currentOrganizationSelected.name);

  /**
   * USER ADMIN 2.0: Only get Survey Groups for the first item 
   */
  this.reqSurveyGroups(this.currentOrganizationSelected.name)
  this.loadingFlag = true;
}



public getUsersName(index: number): string {

  if (this.usersInView[index][0])
    return this.usersInView[index][0]["user_metadata"]["name"];

  if (this.usersInView[index]["user_metadata"])
  {
    let userMetaData: JSON = this.usersInView[index]["user_metadata"];
    
    if (userMetaData["name"]) {
      if (userMetaData["name"].length > 28)
        return userMetaData["name"].slice(0 , 23) + "..."
    }
    else {
      return "Name not set by user";
    }

    return userMetaData["name"];
  }

    return "Name not set by user";
}

public getUserRole(index: number): string {

  if (this.usersInView[index][0])
    return this.usersInView[index][0]["app_metadata"]["user_role"];

  if (this.usersInView[index]["app_metadata"])
  {
    let appMetaData: JSON = this.usersInView[index]["app_metadata"];

    if (appMetaData["user_role"])
    {
      if (appMetaData["user_role"].length > 30)
        return appMetaData["user_role"].slice(0, 27) + "...";
      
    }
    else 
      return "User role not set by user";


    return appMetaData["user_role"];
  }

    return "User role not set by user";
}

public getUsersTitle(index: number): string {
  
  if (this.usersInView[index][0])
    return this.usersInView[index][0]["user_metadata"]["job_title"];

  if (this.usersInView[index]["user_metadata"])
  {
    let userMetaData: JSON = this.usersInView[index]["user_metadata"];

    if (userMetaData["job_title"]) {

      if (userMetaData["job_title"].length > 30) 
        return userMetaData["job_title"].slice(0 , 27) + "..."
      
    }
    else
      return "User role not set by user";

    return userMetaData["job_title"];
  }

    return "User role not set by user";
}  

public getUsersEmail(index: number): string {

  if (this.usersInView[index][0])
    return this.usersInView[index][0]["email"];

  if (this.usersInView[index]) {

    if (this.usersInView[index]["email"].length > 30)
      return this.usersInView[index]["email"].slice(0 , 28) + "..."
      
    return this.usersInView[index]["email"];
  }
  
    return "Email not set by user"
}

public inviteUser(): void {

  if (this.currentSurveyGroupSelected) {
    let city = this.currentSurveyGroupSelected.name;

    let surveyGroup: JSON[] = this.surveyGroupNameAndObjectDetails.get(this.currentSurveyGroupSelected.name);
    let cityId =  surveyGroup['cityID'];

    let dialogRef = this.dialog.open(AdminInviteUserDialog, {
      data: { cityName: city,
              cityID: cityId,
            },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadingSnackBar.showLoadingSnackBar();
      this.loadingFlag = true

      this.resetAllStateArrays();
      this.webGetOrganizations();
    });
  }
  else {
    this.loadingSnackBar.showLoadingSnackBarWithMessageAndTimer("No Survey Group Selected");
  }
}

private resetAllStateArrays()
{
  this.organizationsInView = [];
  this.surveyGroupsInView = [];
  this.usersInView = [];

  this.organizationAndSurveyGroupPairs.clear();
  this.surveyGroupAndUserPairs.clear();
  this.surveyGroupNameAndObjectDetails.clear();
}

public editUserRole(index: number): void {
  

  let selectedUser: JSON = this.usersInView[index];
  let userId = selectedUser["user_id"];

  let surveyGroup: JSON[] = this.surveyGroupNameAndObjectDetails.get(this.currentSurveyGroupSelected.name);
  let cityId =  surveyGroup['cityID'];
  
  let userEmail = selectedUser["email"];

  let userName;
  let userJobTitle;
  if (selectedUser["user_metadata"])
  {
    userName = selectedUser["user_metadata"]["name"];
    userJobTitle = selectedUser["user_metadata"]["job_title"];
  }
  else
  {
    userName = selectedUser["email"]
    userJobTitle = "User Job Title not set by user"
  }

  let userRole = selectedUser["app_metadata"]["user_role"]; 


  let dialogRef = this.dialog.open(AdminEditUserRoleDialog, {
    data: {
      userId: userId,
      cityId: cityId,
      city: this.currentSurveyGroupSelected.name,
      userEmail: userEmail,
      userName: userName,
      userJobTitle: userJobTitle,
      listOfSurveyGroups: this.surveyGroupsInView,
      mapOfSurveyGroupAndData: this.surveyGroupNameAndObjectDetails,
      userRole: userRole,
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.loadingSnackBar.showLoadingSnackBar();
    this.loadingFlag = true
    this.resetAllStateArrays();
    this.webGetOrganizations();
  })
}

public deleteUser(index: number): void {
  let selectedUser: JSON = this.usersInView[index];
  this.loadingSnackBar.showLoadingSnackBarWithMessage("Deleting User...");
  this.kumulosService.webDeleteUser(selectedUser["user_id"]).subscribe(res => 
    {
      this.loadingSnackBar.dismissLoadingSnackBar();
      this.resetAllStateArrays();
      this.webGetOrganizations();
    });
}

public getAllUserEmails(): void {
  let currentUserEmail: string = localStorage.getItem("userEmail");
  currentUserEmail = currentUserEmail.slice(1, (currentUserEmail.length - 1))
  
  this.loadingSnackBar.showLoadingSnackBarWithMessage("Sending all users emails...")

  this.kumulosService.utilityEmailAllUsers(currentUserEmail).subscribe(response => {
    (response);
    this.loadingSnackBar.dismissLoadingSnackBar();
    this.loadingSnackBar.showLoadingSnackBarWithMessageAndTimer("Email succesfully sent");
  })
}

}

@Component({
  selector: 'adminInviteUserDialog',
  templateUrl: './adminInviteUserDialog.html',
  styleUrls: ['./adminInviteUserDialog.css']
})
export class AdminInviteUserDialog {

  httpRequestFlag: boolean;
  inviteUserForm: FormGroup;
  dataFromParent: any;

  listOfAllCities: Array<string>;
  mapOfCitiesAndId: Map<string, string>;
  
  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private formBuilder: FormBuilder, 
              public kumulosService: KumulosService,public renderer: Renderer, private ngZone: NgZone) {

    this.initMemberVariables();
    this.getAllCities();
    
    this.dataFromParent = data;
    this.inviteUserForm = this.formBuilder.group({
     email: ['', [Validators.required, ValidationService.emailValidator]],
     surveyGroup: [data.cityName],
     name: [''],
     jobTitle: [''],
     userRole: [''],
    });
  }

  private initMemberVariables()
  {
    this.listOfAllCities = new Array();
    this.mapOfCitiesAndId = new Map();
  }

  private getAllCities()
  {
    this.kumulosService.getAllCities()
      .subscribe(response => {
        response.payload.forEach(city => {
          this.listOfAllCities.push(city.name);
          this.mapOfCitiesAndId.set(city.name, city.cityID);
        });
      });
  }

  public inviteNewUser(): void {
    this.httpRequestFlag = true;
    let inviteUserFormValue = this.inviteUserForm.value;

    this.kumulosService.webAdminInviteUser(inviteUserFormValue.email, inviteUserFormValue.surveyGroup,
                                            this.dataFromParent.cityID, inviteUserFormValue.userRole, 
                                            inviteUserFormValue.name, inviteUserFormValue.jobTitle)
      .subscribe(response => {
        this.httpRequestFlag = false;
        this.dialog.closeAll();
      });
  }

  onSubmit() {}
}

@Component({
  selector: 'adminEditUserRole',
  templateUrl: './adminEditUserRole.html',
  styleUrls: ['./adminEditUserRole.css']
})
export class AdminEditUserRoleDialog {

  httpRequestFlag: boolean;
  editUserForm: FormGroup;
  dataFromParent: any;

  listOfAllCities: Array<string>;
  mapOfCitiesAndId: Map<string, string>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public router: Router, private formBuilder: FormBuilder, 
                public kumulosService: KumulosService, public dialog: MatDialog) 
  {
    this.initMemberVariables();
    this.getAllCities();
    
    this.dataFromParent = data;

    this.editUserForm = this.formBuilder.group({
      email: [this.dataFromParent.userEmail, [Validators.required, ValidationService.emailValidator]],
      surveyGroup: [this.dataFromParent.city],
      name: [this.dataFromParent.userName],
      jobTitle: [this.dataFromParent.userJobTitle],
      userRole: [this.dataFromParent.userRole],
    })
  }

  private initMemberVariables()
  {
    this.listOfAllCities = new Array();
    this.mapOfCitiesAndId = new Map();
  }

  private getAllCities()
  {
    this.kumulosService.getAllCities()
      .subscribe(response => {
        response.payload.forEach(city => {
          this.listOfAllCities.push(city.name);
          this.mapOfCitiesAndId.set(city.name, city.cityID);
        });
      });
  }


  public editUser(): void {
    this.httpRequestFlag = true;
    let formVal = this.editUserForm.value;

    let cityId = this.mapOfCitiesAndId.get(formVal.surveyGroup);
    this.kumulosService.webAdminUpdateUser(formVal.userRole, this.dataFromParent.userId, formVal.email, formVal.name, formVal.jobTitle,
                                            cityId).subscribe(resposne => { this.dialog.closeAll(); })
  }
}