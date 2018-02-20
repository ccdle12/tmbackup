import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate, CanDeactivate } from '@angular/router';
import { AuthService } from './auth.service';
import { SurveyComponent } from '../../main_app/take_survey/survey_module/survey/survey.component';
import {Observable} from 'rxjs/Observable';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class SaveSurveyGuardService implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private auth: AuthService, private router: Router) { }
  

    
    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
      return true;
    }


}