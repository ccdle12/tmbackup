import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { CustomerEngagementSurveyComponent } from './customerEngagementSurvey.component';
import { customerEngagementSurveyRouting } from './customerEngagementSurvey.routing';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { MdSliderModule, MdTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, customerEngagementSurveyRouting, MdSliderModule, FormsModule, MdTooltipModule],
  declarations: [CustomerEngagementSurveyComponent],
  providers: [KumulosService],
  
})
export class CustomerEngagementSurveyModule { }