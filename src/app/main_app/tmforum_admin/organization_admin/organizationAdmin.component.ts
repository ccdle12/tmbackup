import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog, MatTooltip, MatSnackBar } from '@angular/material';
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
    console.log(this.organizationsJSON[index].organizationID);
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

// @Component({
//   selector: 'editUserRole',
//   templateUrl: '../../shared/dialogs/editUserRole.html',
//   styleUrls: ['../../shared/dialogs/editUserRole.css']
// })
// export class EditUserRole {

//   public httpRequestFlag: boolean;

//   public userRole: string;
//   public userName: string;
//   public userJobTitle: string;
//   public userEmail: string;
//   public userId: string;

//   constructor(public router: Router, public editRoleService: EditRoleService, public kumulosService: KumulosService, public dialog: MatDialog) {
//     this.userRole = this.editRoleService.getUserRole();
//     this.userName = this.editRoleService.getUserName();
//     this.userJobTitle = this.editRoleService.getUserJobTitle();
//     this.userEmail = this.editRoleService.getUserEmail();
//     this.userId = this.editRoleService.getUserId();

//   }

//   public updateUserRole(userRole: string): void {
//     this.userRole = userRole;
//   }

//   public changeUserRole(): void {
//     this.httpRequestFlag = true;

//     this.kumulosService.updateUserRole(this.userRole, this.userId, this.userEmail, this.userName)
//     .subscribe(response => 
//       {
//         this.dialog.closeAll()
//       });

//   }
// }