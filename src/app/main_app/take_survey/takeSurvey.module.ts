import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule }  from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { takeSurveyRouting } from './takeSurvey.routing';

import { TakeSurveyComponent } from './takeSurvey.component';

@NgModule({
  imports: [takeSurveyRouting, CommonModule],
  declarations: [TakeSurveyComponent],
  providers: [],
  
})
export class TakeSurveyModule { }