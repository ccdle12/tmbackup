import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/modules/sharedModule';

import { UserRoleGuardService } from '../../shared/services/userRole-guard.service';

import { tmforumAdminRouting } from './tmforumAdmin.routing'
import { TMForumAdminComponent } from './tmforumAdmin.component'
import { OrganizationAdminComponent } from './organization_admin/organizationAdmin.component'
import { MatSliderModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule} from '@angular/material';


@NgModule({
  imports: [tmforumAdminRouting, SharedModule, CommonModule, MatTooltipModule, MatSliderModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule],
  declarations: [TMForumAdminComponent, OrganizationAdminComponent],
  providers: [UserRoleGuardService],
})
export class TMForumAdminModule { }