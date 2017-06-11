import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { takeSurveyRouting } from './takeSurvey.routing';
import { MdCardModule } from '@angular/material';

import { TakeSurveyComponent } from './takeSurvey.component';
import { CustomerEngagementComponent } from './customerEngagement/customerEngagement.component';

@NgModule({
  imports: [takeSurveyRouting, CommonModule, MdCardModule],
  declarations: [TakeSurveyComponent, CustomerEngagementComponent],
  providers: [],
  
})
export class TakeSurveyModule { }