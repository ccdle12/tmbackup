import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { KumulosService } from '../shared/services/kumulos.service';
import { MatDialog } from '@angular/material';
import { StylingService } from '../shared/services/styling.service'; 

@Component({
    selector: 'welcome-page',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
}) 
export class WelcomeComponent   {

 constructor(public authService: AuthService, 
             public dialog: MatDialog,
             public stylingService: StylingService) 
             { }

  openDialog(): void {
    this.dialog.open(RegisterCityDialog);
  }

  public seeDemoStyle() 
  {
    return { 'background-color': this.stylingService.getPrimaryColour("grey")};
  }

  public DMMStyle() 
  {
    return { 'color': this.stylingService.getPrimaryColour("red")};
  }

  public registerMyInterestStyle()
  {
    return { 'background-color': this.stylingService.getPrimaryColour("grey")};
  }

  public loginStyle()
  {
    return { 'background-color': this.stylingService.getPrimaryColour("red")};
  }

  public digitalTransformers()
  {
    return { 'color': this.stylingService.getPrimaryColour("black")};
  }
  
}

@Component({
  selector: 'registerCityDialog-dialog',
  templateUrl: 'registerCityDialog.html',
})
export class RegisterCityDialog {

  allCities: Array<String>;

  constructor(public kumulosService: KumulosService) {
    this.initializeInstanceVariables();
    this.getAllCitiesFromKumulos();  
  }

  initializeInstanceVariables(): void {
    this.allCities = new Array();
  }

  getAllCitiesFromKumulos(): void {
    this.kumulosService.getAllCities()
      .subscribe(responseJSON => {
        responseJSON.payload.map(eachCity => { this.allCities.push(eachCity.name); }); 
      });

  }
}
