import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';

@Component({
  selector: 'app-takesurvey',
  templateUrl: './takeSurvey.component.html',
  styleUrls: ['./takeSurvey.component.css']
})
export class TakeSurveyComponent {

  activeCityVersion: string;
  takeSurveyDashboard: Array<JSON>;

  constructor(public router: Router, public kumulosService: KumulosService) {
    
    this.intializeInstanceVariables();

    this.getActiveVersionForCity();
  }

  intializeInstanceVariables(): void {
     this.takeSurveyDashboard = new Array();
  }

  getActiveVersionForCity(): void {
    this.kumulosService.getActiveVersionForCity()
      .subscribe(responseJSON => {
        this.activeCityVersion = responseJSON.payload;
        console.log("active city version: ", this.activeCityVersion);

        this.getWebDashboard();
      });
  }

  getWebDashboard(): void {
    this.kumulosService.getWebDashboard(this.activeCityVersion)
      .subscribe(responseJSON => { 
        this.takeSurveyDashboard = responseJSON.payload;
        console.log(this.takeSurveyDashboard[5]);
        console.log(this.takeSurveyDashboard[0]['dimensionText']);
    });
  }

  
  inChildComponents(): boolean {
        let currentUrl = this.router.url;

        let urlRegex = '(\/takesurvey\/.*)'
        if (currentUrl.match(urlRegex)) {
            return false;
        }
        return true;
  }
}
