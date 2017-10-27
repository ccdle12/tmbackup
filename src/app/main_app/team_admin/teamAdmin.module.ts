import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatButtonModule, MatGridListModule, MatIconModule, MatTooltipModule, MatButtonToggleModule } from '@angular/material';

import { teamAdminRouting } from './teamAdmin.routing';
import { TeamAdminComponent } from './teamAdmin.component';
import { KumulosService } from '../../shared/services/kumulos.service';
import { ValidationService } from '../../shared/services/validation.service';
// import { BulkInviteComponent } from './bulk_invite/bulkInvite.component';

@NgModule({
    imports: [teamAdminRouting, CommonModule, MatCardModule, MatButtonModule, MatGridListModule, MatIconModule, MatTooltipModule, MatButtonToggleModule],
    declarations: [TeamAdminComponent],
    providers: [KumulosService, ValidationService],
})

export class TeamAdminModule {};