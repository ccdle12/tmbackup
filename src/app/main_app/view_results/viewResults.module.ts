import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { viewResultsRouting } from './viewResults.routing';
import { ViewResultsComponent } from './viewResults.component';

// import { sharedModu } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { SharedModule } from '../../shared/modules/sharedModule';
import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { MatSliderModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule} from '@angular/material';

import { AdjustAggregatesComponent } from './adjust_aggregates/adjustAggregates.component';
import { MyOwnResultsComponent } from './my_own_results/myOwnResults.component';
import { OrganizationResultsComponent } from './our_organization_results/organizationResults.component';
import { TeamDynamicsComponent } from './team_dynamics/teamDynamics.component';

import { UserRoleGuardService } from '../../shared/services/userRole-guard.service';
import {AccordionModule} from 'primeng/primeng';

@NgModule({
  imports: [viewResultsRouting, FormsModule, SharedModule, CommonModule, Ng2GoogleChartsModule, MatTooltipModule, MatTabsModule, MatButtonModule, MatSnackBarModule, AccordionModule],
  declarations: [ViewResultsComponent, AdjustAggregatesComponent, GoogleChart, MyOwnResultsComponent, OrganizationResultsComponent, TeamDynamicsComponent ],
  providers: [UserRoleGuardService],
})
export class ViewResultsModule { }