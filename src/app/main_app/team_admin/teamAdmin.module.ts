import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { TeamAdminComponent}       from './teamAdmin.component';
import { teamAdminRouting}         from './teamAdmin.routing';
import { UserProfilesService }     from '../../shared/services/userProfiles.service';

@NgModule({
    imports: [teamAdminRouting, CommonModule],
    declarations: [TeamAdminComponent],
    providers: [UserProfilesService],
})

export class TeamAdminModule {};