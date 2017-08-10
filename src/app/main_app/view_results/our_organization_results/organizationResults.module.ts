import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationResultsComponent } from './organizationResults.component';
import { KumulosService } from '../../../shared/services/kumulos.service';

import { FormsModule } from '@angular/forms';
// import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [],
  providers: [KumulosService],
})
export class OrganizationResultsModule { }