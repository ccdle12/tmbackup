import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { takeSurveyRouting } from './takeSurvey.routing';
import { MatCardModule, MatSnackBarModule, MatProgressBarModule } from '@angular/material';

import { TakeSurveyComponent } from './takeSurvey.component';
import { KumulosService } from '../../shared/services/kumulos.service';

@NgModule({
  imports: 
  [
    takeSurveyRouting, 
    CommonModule, 
    MatCardModule, 
    MatSnackBarModule, 
    MatProgressBarModule,
  ],
  declarations: 
  [
    TakeSurveyComponent,
  ],
  providers: 
  [
    KumulosService
  ],
  
})
export class TakeSurveyModule { }