import { Component, Input }  from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';
import { DeleteUserService } from '../../shared/services/deleteUser.service';
import { EditRoleService } from '../../shared/services/editRole.service';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';

import {NgZone, Renderer, ElementRef, ViewChild} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LicenseService } from '../../shared/services/license.service';

import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';
import { StylingService } from '../../shared/services/styling.service';

@Component({
  selector: 'teamAdmin',
  templateUrl: 'teamAdmin.component.html',
  styleUrls: ['./teamAdmin.component.css']
})

export class TeamAdminComponent  { 
  userProfiles:  JSON[];
  userProfilesSize;
  public loadingFlag: boolean;

  constructor(public authService: AuthService, 
              private kumulosService: KumulosService, 
              public dialog: MatDialog, 
              public loadingSnackBar: LoadingSnackBar, 
              public deleteUserService: DeleteUserService, 
              public editRoleService: EditRoleService,
              public licenseService: LicenseService, 
              public snackbar: MatSnackBar, 
              public router: Router) 
  {
    this.loadingFlag = true
    this.getAllUsers();
  }

  private getAllUsers(): void {
    this.loadingSnackBar.showLoadingSnackBar();
    
    this.kumulosService.getWebUsers().subscribe(response => {
          this.userProfiles = response.payload
          this.userProfilesSize = Object.keys(this.userProfiles).length;
          this.loadingSnackBar.dismissLoadingSnackBar();
          this.loadingFlag = false;
    });
  }

  public routeToBulkInvite()
  {
    this.router.navigateByUrl('/main/bulkinvite');
  }

  public addNewUser(): void 
  {  
    if (this.userProfilesSize + 1 > this.licenseService.getMaxUsers())
      this.snackbar.open("Maximum Users Reached: " + this.licenseService.getMaxUsers(), "Dismiss");
    else
    {
      let dialogRef = this.dialog.open(InviteUserDialog);

      dialogRef.afterClosed().subscribe(result => {
          this.getAllUsers();
        });
    }
  }

  public deleteUser(index: number): void {
    let deleteUser: JSON = this.userProfiles[index];
    let userId: string = deleteUser['user_id']; 
    this.deleteUserService.deleteUser(index, userId);
    let dialogRef = this.dialog.open(DeleteUserDialog);

    dialogRef.afterClosed().subscribe(result => {
        this.getAllUsers();
      })
  }
  
  public editUserRole(index: number): void {
    let editUser: string = JSON.stringify(this.userProfiles[index]);

    this.editRoleService.cacheUserJSON(editUser);
    let dialogRef = this.dialog.open(EditUserRole);

    dialogRef.afterClosed()
      .subscribe(resposne => {
        this.getAllUsers();
      });
  }

  public getUsersName(index: number): string {
    let userName: string;

    if(!this.userProfiles[index])
      return "Name not set by user"

    if (this.userProfiles[index]['name'])
    {
      if (this.userProfiles[index]['name'].length > 30) {
        userName = this.userProfiles[index]['name'].slice(0, 23) + "..."
      }
      else {
        userName = this.userProfiles[index]['name'];
      }
    }
    else
      userName = "Name not set by user";
  
    return userName;
  }

  public getUsersTitle(index: number): string {
    let userTitle: string;

    if(!this.userProfiles[index])
      return "Title not set by user"

    if (this.userProfiles[index]['headline']) {
      if (this.userProfiles[index]['headline'].length > 30) {
        userTitle = this.userProfiles[index]['headline'].slice(0, 23) + "..."
      }
      else {
        userTitle = this.userProfiles[index]['headline'];
      }
      
    }
    else
      userTitle = "Job title not set by user";
  
    return userTitle;
  }

  public getUsersEmail(index: number): string {
    let userEmail: string;


    if(!this.userProfiles[index])
      return "Email not set by user"

    if (this.userProfiles[index]["email"]) {
      if (this.userProfiles[index]['email'].length > 30) {
        userEmail = this.userProfiles[index]["email"].slice(0, 23) + "..."
      }
      else {
        userEmail = this.userProfiles[index]["email"];
      }
    }
    else {
      userEmail = "User Email not set by user"
    }

    return userEmail;
  }

  public notAdminOrSuperUser(index: number) {
    let userRole = this.userProfiles[index]["app_metadata"]["user_role"];

    if (userRole == "Admin" || userRole == "Super User") {
      return false;
    }
    return true;
  }
}

@Component({
  selector: 'inviteUserDialog',
  templateUrl: '../../shared/dialogs/inviteUserDialog.html',
  styleUrls: ['../../shared/dialogs/inviteUserDialog.css']
})
export class InviteUserDialog {

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
    let cityId: string = this.getCityId();
    let email: string = this.inviteUserForm.value.email;
    
    this.httpRequestFlag = true;
    this.kumulosService.inviteUser(email, cityName, cityId).subscribe(responseJSON => {
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

@Component({
  selector: 'deleteUserDialog',
  templateUrl: '../../shared/dialogs/deleteUserDialog.html',
  styleUrls: ['../../shared/dialogs/deleteUserDialog.css']
})
export class DeleteUserDialog {
  httpRequestFlag: boolean;
  
  constructor(public dialog: MatDialog, public router: Router, public deleteUserService: DeleteUserService, public kumulosService: KumulosService) {
  }

  public deleteUser() {
    let deleteUserId: string = this.deleteUserService.getUserId();
    
    this.httpRequestFlag = true;
    this.kumulosService.deleteUser(deleteUserId).subscribe(responseJSON => {
      
      this.dialog.closeAll();
     }); 
  }
}

@Component({
  selector: 'editUserRole',
  templateUrl: '../../shared/dialogs/editUserRole.html',
  styleUrls: ['../../shared/dialogs/editUserRole.css']
})
export class EditUserRole {

  public httpRequestFlag: boolean;

  public userRole: string;
  public userName: string;
  public userJobTitle: string;
  public userEmail: string;
  public userId: string;

  constructor(public router: Router, public editRoleService: EditRoleService, public kumulosService: KumulosService, public dialog: MatDialog) {
    this.userRole = this.editRoleService.getUserRole();
    this.userName = this.editRoleService.getUserName();
    this.userJobTitle = this.editRoleService.getUserJobTitle();
    this.userEmail = this.editRoleService.getUserEmail();
    this.userId = this.editRoleService.getUserId();

  }

  public updateUserRole(userRole: string): void {
    this.userRole = userRole;
  }

  public changeUserRole(): void {
    this.httpRequestFlag = true;

    this.kumulosService.updateUserRole(this.userRole, this.userId, this.userEmail, this.userName)
    .subscribe(response => 
      {
        this.dialog.closeAll()
      });

  }
}

