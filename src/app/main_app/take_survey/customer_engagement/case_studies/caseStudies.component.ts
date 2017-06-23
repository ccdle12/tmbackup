import { Component } from '@angular/core';
import { MdSliderModule, MdSidenavModule  } from '@angular/material';
import { KumulosService } from '../../../../shared/services/kumulos.service';

@Component({
  selector: 'customerEngagementCaseStudies',
  template: `<h1>Case Studies</h1>`,
  providers: [KumulosService] 
})
export class CustomerEngagementCaseStudies { 

    caseStudies: any;

    constructor(public kumulos: KumulosService) {
        let parsedSurveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));
        let areaID = parsedSurveyDashboard[0]['areaID'];
        let dimensionID = parsedSurveyDashboard[0]['dimensionID'];

        this.kumulos.getCaseStudies(areaID, dimensionID).subscribe(responseJSON => {
            console.log("case studies", responseJSON.payload);
        })
    }
}