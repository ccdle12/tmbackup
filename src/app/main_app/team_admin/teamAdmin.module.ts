import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCardModule, MdButtonModule, MdGridListModule } from '@angular/material';


import { teamAdminRouting } from './teamAdmin.routing';
import { TeamAdminComponent } from './teamAdmin.component';
import { UserProfilesService } from '../../shared/services/userProfiles.service';


@NgModule({
    imports: [teamAdminRouting, CommonModule, MdCardModule, MdButtonModule, MdGridListModule],
    declarations: [TeamAdminComponent],
    providers: [UserProfilesService],
})

export class TeamAdminModule {};