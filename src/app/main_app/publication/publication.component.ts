import { Component } from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog } from '@angular/material';

import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';
import { LicenseService } from '../../shared/services/license.service';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent {

  public publicationLevel: number;

  constructor(public kumulosService: KumulosService, public loadingSnackBar: LoadingSnackBar, 
              public dialog: MatDialog, public authService: AuthService, public licenseService: LicenseService) {
    this.getPublicationLevel();
    this.licenseService.getLicenseType();
   };

   private getPublicationLevel(): void {
    this.loadingSnackBar.showLoadingSnackBar();
    let user: JSON = JSON.parse(localStorage.getItem('user'));
    let cityID: string = user['city_id'];

    this.kumulosService.getSingleCity(cityID)
      .subscribe(responseJSON => 
      {
        this.publicationLevel = responseJSON.payload[0]['publicationLevel'];
        this.persistPublicationLevel();
        this.loadingSnackBar.dismissLoadingSnackBar();
      })
   }

   public hasPublicationLevel()
   {
     return localStorage.getItem('publicationLevel') ? true : false;
   }

   private persistPublicationLevel(): void 
   {
    localStorage.setItem('publicationLevel', String(this.publicationLevel));
   }

   public openLevel(): any {
     if (this.publicationLevel == 1) 
      return { 'background-color': '#589e2d', 'color': 'white' };
   }

   public openWithinGroupLevel(): any {
     if (this.publicationLevel == 2) 
      return { 'background-color': '#589e2d', 'color': 'white' };
   }

   public anonymousLevel(): any {
     if (this.publicationLevel == 3) 
      return { 'background-color': '#589e2d', 'color': 'white' };
   }

   public closedLevel(): any {
     if (this.publicationLevel == 4) 
      return { 'background-color': '#589e2d', 'color': 'white' };
   }
   
   public setPublicationLevel(selectedLevel: string) {
    this.persistSelectedPublicationLevel(selectedLevel);
    let dialogRef = this.dialog.open(UpdatePublicationLevelDialog);
    
    dialogRef.afterClosed().subscribe(resposne => {
      this.getPublicationLevel();
    });
   }

   private persistSelectedPublicationLevel(selectedLevel: string) {
     localStorage.setItem('selectedPublicationLevel', selectedLevel);
   }

   public publishVersion(): void {
      let dialogRef = this.dialog.open(PublishSurveyDialog);

      dialogRef.afterClosed().subscribe(response => {
        this.getPublicationLevel();
      });
   }

   private hasActiveCityVersion(): boolean {
     return localStorage.getItem('activeCityVersion') ? true : false;
   }
}

@Component({
  selector: 'updatePublicationLevel',
  templateUrl: './updatePublicationLevelDialog.html',
  styleUrls: ['./updatePublicationLevelDialog.css'],
})
export class UpdatePublicationLevelDialog {

  public publicationLevel: number;
  public selectedPubLevel: string;
  public httpRequestFlag: boolean;
  public publicationLevelText: string;
  public isLicenseValid: boolean;

  constructor(public kumulosService: KumulosService, public dialog: MatDialog, public licenseService: LicenseService) {
    this.setLicenseValid();
    this.setPublicationLevel();
    this.setSelectedPubLevel();
    this.injectText();
  }

  public setLicenseValid()
  {
    this.isLicenseValid = this.licenseService.isLicenseValid();
  }

  public setPublicationLevel(): void {
    if (this.hasPublicationLevel())
      this.publicationLevel = Number(localStorage.getItem('publicationLevel'));
  }

  private hasPublicationLevel(): boolean 
  {
    return localStorage.getItem('publicationLevel') ? true : false;
  }

  public setSelectedPubLevel(): void {
     if (this.hasSelectedPublicationLevel())
        this.selectedPubLevel = localStorage.getItem('selectedPublicationLevel');
  }

  private hasSelectedPublicationLevel(): boolean {
    return localStorage.getItem('selectedPublicationLevel') ? true : false;
  }


  public injectText(): any {
    switch(this.selectedPubLevel) {
      case 'Open':
        this.publicationLevelText = "This sets the publication level to open. The organization results will contribute to the global benchmark and be viewable by other organizations (team dynamics will not be shown), and you will be able to see results from other organizations."
        break;

      case 'Open within Group':
        this.publicationLevelText = "This sets the publication level to open within a predefined group. The organization results will contribute to the global benchmark and will only be viewable by other organizations in your predefined group " +
        "(team dynamics will not be shown). You will be able to see the global benchmark, but only be able to see results from other organizations in your group."
        break;

      case 'Anonymous':
        this.publicationLevelText = "This sets the publication level to anonymous. The organization results will contribute to the global benchmark and be viewable by other organizations (team dynamics will not be shown). You will be able to see the benchmark but you will not see results from other organizations."
        break;

      case 'Closed':
        this.publicationLevelText = "This will set the publication level to closed. You will only see your organization's results. The organization results will not contribute to the global benchmark and you will not be able to see the benchmark, or other organization's results."
        break;
    }
  }

  public updateCityPublicationLevel(): void {

    if (this.hasUser) {
      if (this.selectedPubLevel == 'Open within Group') {
        this.dialog.closeAll();
        this.openSelectCityDialog();
      } else {
        let user: JSON = JSON.parse(localStorage.getItem('user'));

        let cityID: string = user['city_id'];

        let publicationLevel: string = this.getPublicationLevel();

        let publicationCtyOrGroup: string = user['city'];

        this.httpRequestFlag = true;
        this.kumulosService.updateCityPublicationLevel(cityID, publicationLevel, publicationCtyOrGroup)
          .subscribe(responseJSON => 
          {
            console.log(responseJSON.payload);
            this.dialog.closeAll();
          });
      }
    }
  }

  public openSelectCityDialog() {
    let dialogRef = this.dialog.open(SelectCityOrgDialog);
  }

  private hasUser(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  private getPublicationLevel(): string {
    switch(this.selectedPubLevel) {
        case 'Open':
          return '1';
        
        case 'Open within Group':
          return '2';
        
        case 'Anonymous':
          return '3';
        
        case 'Closed':
          return '4';

        default: 
          return '1';
      }
  }
}

@Component({
  selector: 'publishSurveyDialog',
  templateUrl: './publishSurveyDialog.html',
  styleUrls: ['./publishSurveyDialog.css'],
})
export class PublishSurveyDialog {
  httpRequestFlag: boolean;
  isLicenseValid: boolean;
  
  constructor(public kumulosService: KumulosService, public dialog: MatDialog, public licenseService: LicenseService) 
  {
    this.setIsLicenseValid();
  }

  public setIsLicenseValid()
  {
     this.isLicenseValid = this.licenseService.isLicenseValid();
  }
  public publishVersion() {
    if (this.hasActiveCityVersion()) {
     let activeCityVersion: string = localStorage.getItem('activeCityVersion');

     this.kumulosService.publishVersion(activeCityVersion)
      .subscribe(responseJSON =>
        {
          console.log(responseJSON.payload);
          this.dialog.closeAll();
        })
    }
  }

  private hasActiveCityVersion(): boolean {
    return localStorage.getItem('activeCityVersion') ? true : false;
  }
}

@Component({
  selector: 'selectCityOrgDialog',
  templateUrl: './selectCityOrgDialog.html',
  styleUrls: ['./selectCityOrgDialog.css'],
})
export class SelectCityOrgDialog {

  orgGroups: Array<any>;
  orgGroupNames: Array<any>;
  currentOrgSelected: any;
  orgNameMappedToData: Map<string, any>;
  httpRequestFlag: boolean;

  constructor(public kumulosService: KumulosService, public dialog: MatDialog) 
  {
    this.initializeMemberVariables();
    this.getGroupsandCountries();
  }

  public initializeMemberVariables() 
  {
    this.orgGroups = new Array<any>();
    this.orgGroupNames = new Array<any>();
    this.orgNameMappedToData = new Map<string, any>();
  }

  public getGroupsandCountries() 
  {
    let user = JSON.parse(localStorage.getItem('user'));
    let cityID = user.city_id;

    this.kumulosService.getGroupsandCountries(cityID)
      .subscribe(response => {
        if (response.payload) {
          this.orgGroups = response.payload;
          this.currentOrgSelected = this.orgGroups[0]['name'];
          this.updateOrgGroupNames();
          this.mapOrgNameToData();
        }
      });
  }

  private updateOrgGroupNames() 
  {
    for (let i = 0; i < this.orgGroups.length; i++) {
      this.orgGroupNames.push({label: this.orgGroups[i]['name'], value: {id: i, name: this.orgGroups[i]['name']}});
    }
  }

  private mapOrgNameToData() 
  {
    for (let i = 0; i < this.orgGroups.length; i++) {
      this.orgNameMappedToData.set(this.orgGroupNames[i].label, this.orgGroups[i]);
    }
  }

  public orgHasChanged() 
  {
    //  this.currentOrgSelected = this.orgNameMappedToData.get(this.currentOrgSelected.name);
    //  console.log(this.currentOrgSelected.name);
  }

  public updateCityPubLevelWithGroup()
  {
   if (this.hasUser) 
    {
        let user: JSON = JSON.parse(localStorage.getItem('user'));

        let cityID: string = user['city_id'];
        console.log(cityID);

        let publicationLevel: string = this.getSelectedPubLevel();
        console.log(publicationLevel);

        let publicationCtyOrGroup: string;

        if (!this.currentOrgSelected.name)
          publicationCtyOrGroup = this.currentOrgSelected;
        else
          publicationCtyOrGroup = this.currentOrgSelected.name;

        console.log(publicationCtyOrGroup);

        this.httpRequestFlag = true;
        this.kumulosService.updateCityPublicationLevel(cityID, publicationLevel, publicationCtyOrGroup)
          .subscribe(responseJSON => 
          {
            console.log(responseJSON.payload);
            window.location.reload();
          });
      }
    }

    private hasUser(): boolean 
    {
     return localStorage.getItem('user') ? true : false;
    }

    private getSelectedPubLevel() {
      let pubLevel = localStorage.getItem('selectedPublicationLevel');
      
      switch(pubLevel) {
        case 'Open':
          return '1';
        
        case 'Open within Group':
          return '2';
        
        case 'Anonymous':
          return '3';
        
        case 'Closed':
          return '4';

        default: 
          return '1';
      }
    }
  }