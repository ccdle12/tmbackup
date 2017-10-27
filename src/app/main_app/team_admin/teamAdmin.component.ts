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

@Component({
  selector: 'teamAdmin',
  templateUrl: 'teamAdmin.component.html',
  styleUrls: ['./teamAdmin.component.css']
})

export class TeamAdminComponent  { 
  userProfiles:  JSON[];
  userProfilesSize;

  constructor(public authService: AuthService, private kumulosService: KumulosService, public dialog: MatDialog, 
    public loadingSnackBar: LoadingSnackBar, public deleteUserService: DeleteUserService, public editRoleService: EditRoleService,
    public licenseService: LicenseService, public snackbar: MatSnackBar, public router: Router) {
  
    this.getAllUsers();
  }

  private getAllUsers(): void {
    this.loadingSnackBar.showLoadingSnackBar();
    this.kumulosService.getWebUsers().subscribe(response => {
          console.log("response", response.payload);
          this.userProfiles = response.payload
          console.log("Size of User Profiles: " + Object.keys(this.userProfiles).length);
          this.userProfilesSize = Object.keys(this.userProfiles).length;
          console.log(this.userProfiles);
          this.loadingSnackBar.dismissLoadingSnackBar();
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
    console.log("from edit role service: " + this.editRoleService.getUserJSON());
    let dialogRef = this.dialog.open(EditUserRole);

    dialogRef.afterClosed()
      .subscribe(resposne => {
        this.getAllUsers();
      });
  }



  public getUsersName(index: number): string {
    let userName: string;

    if (this.hasUserMetaData(index))
    {
      userName = this.userProfiles[index]['user_metadata']['name'];
      
      if (userName.length < 1)
        userName = "Name not set by user";
    }
    else 
      userName = "Name not set by user";
    
    return userName;
  }

  public getUsersTitle(index: number): string {
    let userTitle: string;

    if (this.hasUserMetaData(index))
      userTitle = this.userProfiles[index]['user_metadata']['jobTitle'];
    else  if (this.userProfiles[index]['headline'])
      userTitle = this.userProfiles[index]['headline'];
    else 
      userTitle = "Job title not set by user";
    
    if (userTitle.length > 100)
      userTitle = userTitle.slice(0, 60);

    return userTitle;
  }  

  private hasUserMetaData(index: number): boolean {
    return this.userProfiles[index]['user_metadata'] ? true : false;
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
      
      // console.log("response", responseJSON.payload);
      // window.location.reload();
      
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

