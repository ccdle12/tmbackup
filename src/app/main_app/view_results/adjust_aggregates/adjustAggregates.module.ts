import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustAggregatesComponent } from './adjustAggregates.component';
import { KumulosService } from '../../../shared/services/kumulos.service';

import { FormsModule } from '@angular/forms';
import { MdSliderModule, MdTooltipModule, MdSidenavModule, MdButtonToggleModule, MdTabsModule, MdButtonModule, MdIconModule} from '@angular/material';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [],
  providers: [KumulosService],
})
export class AdjustAggregatesModule { }