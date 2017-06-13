import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
import { CustomerEngagementComponent } from './customer_engagement/customerEngagement.component';
import { TakeSurveyDashboardService } from '../../shared/services/takeSurveyDashboard.service'

@Component({
  selector: 'app-takesurvey',
  templateUrl: './takeSurvey.component.html',
  styleUrls: ['./takeSurvey.component.css']
})
export class TakeSurveyComponent {

  private takeSurveyDashboard: Array<JSON>;

  constructor(public router: Router, public kumulosService: KumulosService, public takeSurveyService: TakeSurveyDashboardService) {
    
    this.intializeInstanceVariables();

    this.getActiveVersionForCity();
  }

  private intializeInstanceVariables(): void {
     this.takeSurveyDashboard = new Array();
  }

  private getActiveVersionForCity(): void {
    this.kumulosService.getActiveVersionForCity()
      .subscribe(responseJSON => {
        
        let activeCityVersion: string = responseJSON.payload;
        this.takeSurveyService.setActiveCityVersion(activeCityVersion);

        this.getWebDashboard(activeCityVersion);
      });
  }

  private getWebDashboard(activeCityVersion: string): void {
    this.kumulosService.getWebDashboard(activeCityVersion)
      .subscribe(responseJSON => { 
        this.takeSurveyDashboard = responseJSON.payload;
        this.takeSurveyService.setSurveyDashboard(responseJSON.payload);
    });
  }
  
  private inChildComponents(): boolean {
        let currentUrl = this.router.url;

        let urlRegex = '(\/takesurvey\/.*)'
        if (currentUrl.match(urlRegex)) {
            return false;
        }
        return true;
  }
}
