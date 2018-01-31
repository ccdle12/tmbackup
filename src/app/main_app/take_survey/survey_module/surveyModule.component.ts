import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { StylingService } from '../../../shared/services/styling.service'


@Component({
  moduleId: module.id,
  selector: 'surveyModuel',
  templateUrl: './surveyModule.component.html',
  styleUrls: ['./surveyModule.component.css']
})
export class SurveyModuleComponent  {

    backToDashboardTooltip: String;

    constructor(public router: Router, 
                public authService: AuthService,
                public stylingService: StylingService) 
    { 
        //   this.router.navigateByUrl('/main/takesurvey/surveymodule/survey');
        this.backToDashboardTooltip = "Back To Dashboard";
    }  

    public activeBackgroundColor() {
        return { 'background-color': this.stylingService.getPrimaryColour('red'), 'color': 'white' }; 
    }

    public navStyle()
    {
        return {'background-color': this.stylingService.getPrimaryColour('grey')}
    }

    public routeToPage(surveyPage: String) {
       console.log('routetoPage activated: ' + surveyPage);
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

    public inSurvey() {
        let currentUrl: string = window.location.pathname;
        
        if (currentUrl ===  "/main/takesurvey/surveymodule/survey") {
            return { 'background-color': this.stylingService.getPrimaryColour('red'), 'color': 'white' };    
        } 

    }

    public inEvidence() {
        let currentUrl: string = window.location.pathname;
        // console.log("In Evidence CALLED");
        if (currentUrl ===  "/main/takesurvey/surveymodule/evidence") {
            return { 'background-color': this.stylingService.getPrimaryColour('red'), 'color': 'white' };    
        } 

    }

    public backToDashboard(): void {
        this.router.navigateByUrl('/callback').then(() => this.router.navigateByUrl('/main/takesurvey'));
    }
}
