import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { surveyRouting } from './survey.routing';
import { KumulosService } from '../../../../shared/services/kumulos.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { MdSliderModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/primeng';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { SharedModule } from '../../../../shared/modules/sharedModule';

import { ClickOutsideDirective } from './clickOutSide.directive';

@NgModule({
  imports: [CommonModule, surveyRouting, TooltipModule, SharedModule, MdSliderModule, FormsModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule],
  declarations: [SurveyComponent, ClickOutsideDirective],
  providers: [KumulosService, AuthService],
  
})
export class SurveyModule { }