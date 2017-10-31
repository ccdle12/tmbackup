import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyAdminComponent } from './surveyAdmin.component';
import { KumulosService } from '../../../shared/services/kumulos.service';
import { MatTooltipModule, MatDatepickerModule } from '@angular/material';

@NgModule({
  imports: 
  [
    CommonModule, 
    MatTooltipModule,
    MatDatepickerModule, 
  ],
  declarations: 
  [
    SurveyAdminComponent
  ],
  providers: 
  [
    KumulosService
  ],
})
export class SurveyAdminModule { }