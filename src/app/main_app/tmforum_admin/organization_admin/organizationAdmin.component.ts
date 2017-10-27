import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { KumulosService } from '../../../shared/services/kumulos.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material';

import { MatDialog, MatTooltip } from '@angular/material';

@Component({
  selector: 'organizationAdminComponent',
  templateUrl: './organizationAdmin.component.html',
  styleUrls: ['./organizationAdmin.component.css']
})
export class OrganizationAdminComponent {

    public backToDashboardTooltip;
    public organizationsJSON;

    constructor(public router: Router, public kumulosService: KumulosService) {
      this.webGetOrganizations();
      this.initializeMemberVariables();    
    }

    private webGetOrganizations() {
      this.kumulosService.webGetOrganizations().subscribe(response => {
        this.organizationsJSON = response.payload;
        console.log(response.payload[0]);
        console.log(this.organizationsJSON[0]);
      });
    }

    private initializeMemberVariables(): void {
      this.backToDashboardTooltip = "Back To Dashboard";
    }



    //Highlighting the nav tab
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



  //Nav Bar Routing
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


  
}