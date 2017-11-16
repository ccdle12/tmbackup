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

@Component({
  selector: 'userAdminComponent',
  templateUrl: './userAdmin.component.html',
  styleUrls: ['./userAdmin.component.css']
})
export class UserAdminComponent {

  public backToDashboardTooltip: string;

  /**
   * Variables bound to the view
   */
  public organizationsInView: Array<any>;
  public surveyGroupsInView: Array<any>;
  public currentOrganizationSelected: any;
  public currentSurveyGroupSelected: any;
  public usersInView: Array<any>;


  public surveyGroups: Array<any>; // Is this being used?
  public organizationAndSurveyGroupPairs: Map<string, JSON[]>;
  public surveyGroupAndUserPairs: Map<string, JSON[]>;
  

  constructor(public router: Router, public kumulosService: KumulosService, public dialog: MatDialog,
              public loadingSnackBar: LoadingSnackBar) {
    this.initMemberVariables(); 
    this.getAllOrganizationsAndSurveyGroups();
  }

  private initMemberVariables(): void {
    this.backToDashboardTooltip = "Back To Dashboard";
    this.organizationsInView = new Array();
    this.surveyGroups = new Array();
    this.surveyGroupsInView = new Array();
    this.usersInView = new Array();

    this.organizationAndSurveyGroupPairs = new Map<string, JSON[]>();
    this.surveyGroupAndUserPairs = new Map<string, JSON[]>();
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

            this.currentOrganizationSelected = this.organizationsInView[0].value;
          }
        )
        .catch(res => console.log("there was an error"))
        .then(res => {
              this.organizationsInView.forEach(org => {
                let orgName = org.value.name;
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
        this.reqUsersFromSurveyGroup(element["name"], element["cityID"]);
      });
    })
};

private setInitialSurveyGroupsInView(){
  let listOfCurrentSurveyGroups = this.organizationAndSurveyGroupPairs.get(this.currentOrganizationSelected.name);
  
  this.surveyGroupsInView = [];

  if (listOfCurrentSurveyGroups) {
    listOfCurrentSurveyGroups.forEach(item => {
      this.surveyGroupsInView.push({label: item["name"], value: {id: item["name"], name: item["name"]}});
    });

    this.currentSurveyGroupSelected = this.surveyGroupsInView[0].value;
  }
}

private reqUsersFromSurveyGroup(surveyGroupName: string, cityID: string) {
  this.kumulosService.getWebUsersCityIdOverload(cityID).toPromise()
    .then(res => {
      console.log("Users:");
      console.log(res.payload);
      this.surveyGroupAndUserPairs.set(surveyGroupName, res.payload);
    })
    .catch(res => console.log("There was an error"))
    .then(res => {
      let listOfUsers = this.surveyGroupAndUserPairs.get(this.currentSurveyGroupSelected.name);
      
      if (listOfUsers) {
        listOfUsers.forEach(element => {
            this.usersInView.push(listOfUsers);
          });
      }

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
  if (this.currentSurveyGroupSelected)
    this.usersInView = this.surveyGroupAndUserPairs.get(this.currentSurveyGroupSelected.name);
  else
    this.usersInView = [];
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
  let userName: string;

  if (this.usersInView[index].name)
    userName = this.usersInView[index].name;
  else
    userName = "Name not set by user";

  return userName;
}

public getUsersTitle(index: number): string {
  let userTitle: string;


  return userTitle;
}  

public inviteUser(): void {
  let dialogRef = this.dialog.open(InviteUserDialog, {

  });
}

public editUserRole(index: number): void {

}

public deleteUser(index: number): void {

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
  
  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, public kumulosService: KumulosService, 
              public renderer: Renderer, private ngZone: NgZone) {
    
    this.inviteUserForm = this.formBuilder.group({
     email: ['', [Validators.required, ValidationService.emailValidator]],
    });
  }

  public inviteNewUser(): void {
    let cityName: string = this.getCityName();
    console.log("City Name: " + cityName);
    let cityId: string = this.getCityId();
    let email: string = this.inviteUserForm.value.email;
    
    this.httpRequestFlag = true;
    this.kumulosService.inviteUser(email, cityName, cityId).subscribe(responseJSON => {
      console.log("response", responseJSON.payload);
      // this.reloadPage();
      this.dialog.closeAll();
    })
  }

  private getCityName(): string {
    let userProfile: JSON = this.getUserProfile();
    let city: string = userProfile['app_metadata']['city'];
    return city;
  };

  private getCityId(): string {
    let userProfile: JSON = this.getUserProfile();
    let cityId: string = userProfile['app_metadata']['city_id'];

    return cityId;
  }

  private getUserProfile(): JSON {
    return JSON.parse(localStorage.getItem('userProfile'));
  }

  onSubmit() {}
}