import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog, MatTooltip, MatSnackBar } from '@angular/material';
import { LoadingSnackBar } from '../../../shared/components/loadingSnackBar';

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
      
      // this.kumulosService.webCreateUpdateOrganizations("testOrg", "ben", "chris@chris.com", true, null)
      //   .subscribe(response => {
      //     console.log(response.payload);
      //   });
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
        // this.loadingSnackBar.showLoadingSnackBar();
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
    // let dialogRef = this.dialog.open(InviteUserDialog);

    // dialogRef.afterClosed().subscribe(result => {
        // this.webGetOrganizations();
    // });
  }

}

@Component({
  selector: 'addNewOrgDialog',
  templateUrl: './add_new_org_dialog/addNewOrgDialog.html',
  styleUrls: ['./add_new_org_dialog/addNewOrgDialog.css']
})
export class AddNewOrgDialog {

  // httpRequestFlag: boolean;
  // inviteUserForm: FormGroup;
  
  // @ViewChild('spinnerElement') loadingElement: ElementRef;

  // constructor(public dialog: MatDialog, private formBuilder: FormBuilder, public kumulosService: KumulosService, 
  //             public renderer: Renderer, private ngZone: NgZone) {
    
  //   this.inviteUserForm = this.formBuilder.group({
  //    email: ['', [Validators.required, ValidationService.emailValidator]],
  //   });
  // }

  // public inviteNewUser(): void {
  //   let cityName: string = this.getCityName();
  //   console.log("City Name: " + cityName);
  //   let cityId: string = this.getCityId();
  //   let email: string = this.inviteUserForm.value.email;
    
  //   this.httpRequestFlag = true;
  //   this.kumulosService.inviteUser(email, cityName, cityId).subscribe(responseJSON => {
  //     console.log("response", responseJSON.payload);
  //     // this.reloadPage();
  //     this.dialog.closeAll();
  //   })
  // }

  // private getCityName(): string {
  //   let userProfile: JSON = this.getUserProfile();
  //   let city: string = userProfile['app_metadata']['city'];
  //   return city;
  // };

  // private getCityId(): string {
  //   let userProfile: JSON = this.getUserProfile();
  //   let cityId: string = userProfile['app_metadata']['city_id'];

  //   return cityId;
  // }

  // private getUserProfile(): JSON {
  //   return JSON.parse(localStorage.getItem('userProfile'));
  // }

  // onSubmit() {}
}