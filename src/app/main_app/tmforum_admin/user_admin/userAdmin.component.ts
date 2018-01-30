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
            {
              // console.log(this.organizationsInView[i].value)
              // this.organizationsInView.push({label: res.payload[i].organizationName, value: {id: res.payload[i].organizationName, name: res.payload[i].organizationName}});
              this.organizationAndIdDict.set(this.organizationsInView[i].value, i);
            }
            
            if (!this.currentOrganizationSelected)
            {
              this.currentOrganizationSelected = this.organizationsInView[0].value;
              console.log("Current org selected: ");
              console.log(this.currentOrganizationSelected)
            }
            else 
            {
              let id = this.organizationAndIdDict.get(this.currentOrganizationSelected);
              this.currentOrganizationSelected = this.organizationsInView[id].value;
            }
            
          }
        )
        .catch(res => console.log("there was an error"))
        .then(res => {
              this.organizationsInView.forEach(org => {
                let orgName = org.value.name;
                console.log(orgName)
                this.reqSurveyGroups(orgName);
              });
        })
}

private reqSurveyGroups(orgName: string) {
  return this.kumulosService.webGetSurveysByOrg(orgName).toPromise()
    .then(res => { 
      this.organizationAndSurveyGroupPairs.set(orgName, res.payload);
      return res.payload;
    })
    .catch(res => console.log("There as an error"))
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

//TODO!!!
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
      //Uncommented was causing crash, seems we are cahcing the last survey group selected somewhere??
      // let id = this.surveyGroupAndIdDict.get(this.currentSurveyGroupSelected.id);

      // if (this.surveyGroupsInView.length > 0)
      // this.currentSurveyGroupSelected = this.surveyGroupsInView[id].value;
    }

  }
}

private reqUsersFromSurveyGroup(surveyGroupName: string, cityID: string) {
  this.kumulosService.getWebUsersCityIdOverload(cityID).toPromise()
    .then(res => {
      // console.log("Users for each survey");
      // console.log(res.payload);
      this.surveyGroupAndUserPairs.set(surveyGroupName, res.payload);
    })
    .catch(res => console.log("There was an error"))
    .then(res => {

      let listOfUsers;

      if (this.currentSurveyGroupSelected)
        listOfUsers = this.surveyGroupAndUserPairs.get(this.currentSurveyGroupSelected.name);

      // console.log("LIST OF USERSE!!!!!!!");
      // console.log(listOfUsers);

      if (listOfUsers) {
        this.usersInView = [];
        listOfUsers.forEach(element => {
            // console.log("EACH USER IN LIST");
            // console.log(element);
            this.usersInView.push(listOfUsers);
          });
      }

      // console.log("USERS IN VIEW!!!!");
      if (this.usersInView[0])
        this.usersInView = this.usersInView[0];
      // console.log(this.usersInView);

      this.loadingSnackBar.dismissLoadingSnackBar()
    });
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
  if (this.currentSurveyGroupSelected) {
    // this.usersInView = [];
    this.usersInView = this.surveyGroupAndUserPairs.get(this.currentSurveyGroupSelected.name);
    console.log("CURRENT SURVEY GROUP");
    console.log(this.currentSurveyGroupSelected);

    console.log("Current Survey Group Selected ID!!!")
    console.log(this.surveyGroupAndIdDict.get(this.currentSurveyGroupSelected))
    
  } else {
    this.usersInView = [];
  }
}

public organizationHasChanged(): void {
  this.surveyGroupsInView = [];

  let listOfSurveyGroups = this.organizationAndSurveyGroupPairs.get(this.currentOrganizationSelected.name);

  listOfSurveyGroups.forEach(surveyGroup => {
    let surveyGroupName = surveyGroup["name"];
    this.surveyGroupsInView.push({label: surveyGroupName, value: {id: surveyGroupName, name: surveyGroupName }});
  });

  this.currentSurveyGroupSelected = listOfSurveyGroups[0]
  this.surveyGroupHasChanged();
}



public getUsersName(index: number): string {

  if (this.usersInView[index][0])
    return this.usersInView[index][0]["user_metadata"]["name"];

  if (this.usersInView[index]["user_metadata"])
  {
    let userMetaData: JSON = this.usersInView[index]["user_metadata"];

    // if(userMetaData["name"] && userMetaData["name"].length > 1 && userMetaData["name"] != "" && userMetaData["name"] != " ")  
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

    // if(appMetaData["user_role"] && appMetaData["user_role"].length > 1 && appMetaData["user_role"] != "" && appMetaData["user_role"] != " ")  
    return appMetaData["user_role"];
  }

    return "User role not set by user";
}

public getUsersTitle(index: number): string {
  
  if (this.usersInView[index][0])
    return this.usersInView[index][0]["user_metadata"]["job_title"];

  if (this.usersInView[index]["user_metadata"])
  {
    // console.log("getting user metadata")
    let userMetaData: JSON = this.usersInView[index]["user_metadata"];
    // console.log(userMetaData["job_title"])

    // if(userMetaData["job_tilte"] && userMetaData["job_tilte"].length > 1 && userMetaData["job_tilte"] != "" && userMetaData["job_tilte"] != " ")  
    return userMetaData["job_title"];
  }

    return "User role not set by user";
}  

public getUsersEmail(index: number): string {

  if (this.usersInView[index][0])
    return this.usersInView[index][0]["email"];

  if (this.usersInView[index])
    // if (this.usersInView[index]["email"] && this.usersInView["email"].length > 1 && this.usersInView["email"] != "" && this.usersInView["email"] != " ")
      return this.usersInView[index]["email"];

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
  // this.currentOrganizationSelected = [];
  // this.currentSurveyGroupSelected = [];
  this.usersInView = [];

  this.organizationAndSurveyGroupPairs.clear();
  this.surveyGroupAndUserPairs.clear();
  this.surveyGroupNameAndObjectDetails.clear();
}

public editUserRole(index: number): void {
  
  // let selectedUser: JSON = this.usersInView[index][0];
  let selectedUser: JSON = this.usersInView[index];
  // console.log("SELECTED USER");
  // console.log(selectedUser);
  let userId = selectedUser["user_id"];

  let surveyGroup: JSON[] = this.surveyGroupNameAndObjectDetails.get(this.currentSurveyGroupSelected.name);
  let cityId =  surveyGroup['cityID'];
  
  let userEmail = selectedUser["email"];

  let userName = selectedUser["user_metadata"]["name"];
  let userJobTitle = selectedUser["user_metadata"]["job_title"];
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
    console.log(response);
    this.loadingSnackBar.dismissLoadingSnackBar();
    this.loadingSnackBar.showLoadingSnackBarWithMessageAndTimer("Email succesfully sent");
  })
}


// private hasUserMetaData(index: number): boolean {
//   return this.usersInView[index].user_metadata ? true : false;
// }
// public addSurveyGroup(): void {
//   let dialogRef = this.dialog.open(AddSurveyGroupDialog, {
//     data: {
//             orgName: this.currentOrganizationSelected.name,
//           }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     this.getAllOrganizationsAndSurveyGroups();
//   });
// }

// public editSurveyGroup(surveyGroup: any): void {
//   console.log(surveyGroup);

//     let dialogRef = this.dialog.open(EditSurveyGroupDialog, {
//       data: {
//               orgName: this.currentOrganizationSelected.name,
//               surveyGroup: surveyGroup
//             }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       this.getAllOrganizationsAndSurveyGroups();
//     });
//   }
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
    console.log(this.editUserForm.controls.email.value)
    console.log(this.editUserForm.value.email)
    this.httpRequestFlag = true;
    let formVal = this.editUserForm.value;

    let cityId = this.mapOfCitiesAndId.get(formVal.surveyGroup);
    this.kumulosService.webAdminUpdateUser(formVal.userRole, this.dataFromParent.userId, formVal.email, formVal.name, formVal.jobTitle,
                                            cityId).subscribe(resposne => { this.dialog.closeAll(); })
  }
}