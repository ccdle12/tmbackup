import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { CustomerEngagementSurveyComponent } from './customerEngagementSurvey.component';
import { customerEngagementSurveyRouting } from './customerEngagementSurvey.routing';
import { KumulosService } from '../../../../shared/services/kumulos.service';

@NgModule({
  imports: [CommonModule, customerEngagementSurveyRouting],
  declarations: [CustomerEngagementSurveyComponent],
  providers: [KumulosService],
  
})
export class CustomerEngagementSurveyModule { }