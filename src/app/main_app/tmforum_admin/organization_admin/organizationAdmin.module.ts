import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationAdminComponent } from './organizationAdmin.component';
import { KumulosService } from '../../../shared/services/kumulos.service';

import { FormsModule } from '@angular/forms';
import { MatSliderModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
  imports: [CommonModule, FormsModule, MatTooltipModule],
  declarations: [OrganizationAdminComponent],
  providers: [KumulosService],
})
export class OrganizationAdminModule { }