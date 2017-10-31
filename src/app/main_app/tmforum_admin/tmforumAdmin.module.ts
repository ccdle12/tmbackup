import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/modules/sharedModule';
import { UserRoleGuardService } from '../../shared/services/userRole-guard.service';
import { tmforumAdminRouting } from './tmforumAdmin.routing';
import { TMForumAdminComponent } from './tmforumAdmin.component';
import { OrganizationAdminComponent } from './organization_admin/organizationAdmin.component';
import { SurveyAdminComponent } from './survey_admin/surveyAdmin.component';
import 
{ 
  MatSliderModule, 
  MatCardModule, 
  MatTooltipModule, 
  MatSidenavModule, 
  MatButtonToggleModule, 
  MatTabsModule, 
  MatButtonModule, 
  MatIconModule,  
  MatGridListModule,
  MatCheckboxModule
} from '@angular/material';

import { DropdownModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: 
  [
    tmforumAdminRouting, 
    MatCardModule, 
    SharedModule, 
    CommonModule, 
    MatTooltipModule, 
    MatSliderModule, 
    MatSidenavModule, 
    MatButtonToggleModule, 
    MatTabsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatGridListModule,
    MatCheckboxModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  declarations: 
  [
    TMForumAdminComponent,
    OrganizationAdminComponent, 
    SurveyAdminComponent
  ],
  providers: 
  [
    UserRoleGuardService
  ],
})
export class TMForumAdminModule { }