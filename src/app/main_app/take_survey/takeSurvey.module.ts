import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { takeSurveyRouting } from './takeSurvey.routing';
import { MdCardModule, MdSnackBarModule } from '@angular/material';

import { TakeSurveyComponent } from './takeSurvey.component';
import { KumulosService } from '../../shared/services/kumulos.service';

@NgModule({
  imports: [takeSurveyRouting, CommonModule, MdCardModule, MdSnackBarModule],
  declarations: [TakeSurveyComponent],
  providers: [KumulosService],
  
})
export class TakeSurveyModule { }