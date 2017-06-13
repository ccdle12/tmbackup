import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { takeSurveyRouting } from './takeSurvey.routing';
import { MdCardModule } from '@angular/material';

import { TakeSurveyComponent } from './takeSurvey.component';
import { KumulosService } from '../../shared/services/kumulos.service';
import { TakeSurveyDashboardService } from '../../shared/services/takeSurveyDashboard.service'

@NgModule({
  imports: [takeSurveyRouting, CommonModule, MdCardModule],
  declarations: [TakeSurveyComponent],
  providers: [KumulosService, TakeSurveyDashboardService],
  
})
export class TakeSurveyModule { }