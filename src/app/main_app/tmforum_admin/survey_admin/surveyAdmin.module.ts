import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyAdminComponent } from './surveyAdmin.component';
import { KumulosService } from '../../../shared/services/kumulos.service';

import { FormsModule } from '@angular/forms';
import { MatSliderModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
  imports: [CommonModule, FormsModule, MatTooltipModule],
  declarations: [SurveyAdminComponent],
  providers: [KumulosService],
})
export class SurveyAdminModule { }