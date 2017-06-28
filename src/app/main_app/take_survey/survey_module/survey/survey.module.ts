import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { surveyRouting } from './survey.routing';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { MdSliderModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, surveyRouting, MdSliderModule, FormsModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule],
  declarations: [SurveyComponent],
  providers: [KumulosService, AuthService],
  
})
export class SurveyModule { }