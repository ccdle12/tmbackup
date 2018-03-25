import { Component, ViewChild } from '@angular/core';
import { MatSliderModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule} from '@angular/material';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bestPractice',
  templateUrl: './bestPractice.component.html',
  styleUrls: ['./bestPractice.component.css']
})
export class BestPracticeComponent { 

    bestPractices: JSON[];

    @ViewChild('start') sidenav: MatSidenavModule;

    constructor(public kumulos: KumulosService, public router: Router) {
        let parsedSurveyDashboard = JSON.parse(localStorage.getItem('surveydashboard'));
        let areaID = parsedSurveyDashboard[0]['areaID'];
        let dimensionID = parsedSurveyDashboard[0]['dimensionID'];

        this.kumulos.getBestPractices(areaID, dimensionID).subscribe(responseJSON => {
            this.bestPractices = responseJSON.payload;
        });

    }

     public routeToPage(surveyPage: String) {
        switch(surveyPage) {
          case('survey'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/survey');
            break;
          case ('evidence'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/evidence');
            break;
          case ('bestPractice'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/bestpractice');
            break;
          case ('caseStudies'):
            this.router.navigateByUrl('main/takesurvey/surveymodule/casestudies');
            break;
        }
    }

     public backToTakeSurvey(): void {
      this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/main/takesurvey'));
    }
}