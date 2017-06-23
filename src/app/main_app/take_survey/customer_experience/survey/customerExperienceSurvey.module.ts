import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { CustomerExperienceSurveyComponent } from './customerExperienceSurvey.component';
import { customerExperienceSurveyRouting } from './customerExperienceSurvey.routing';
import { KumulosService } from '../../../../shared/services/kumulos.service';
// import { MdSliderModule, MdTooltipModule } from '@angular/material';
import { MdSliderModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule} from '@angular/material';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, customerExperienceSurveyRouting, MdSliderModule, FormsModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule],
  declarations: [CustomerExperienceSurveyComponent],
  providers: [KumulosService],
  
})
export class CustomerExperienceSurveyModule { }