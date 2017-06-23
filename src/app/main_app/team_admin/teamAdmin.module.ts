import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCardModule, MdButtonModule, MdGridListModule } from '@angular/material';


import { teamAdminRouting } from './teamAdmin.routing';
import { TeamAdminComponent } from './teamAdmin.component';
import { KumulosService } from '../../shared/services/kumulos.service';


@NgModule({
    imports: [teamAdminRouting, CommonModule, MdCardModule, MdButtonModule, MdGridListModule],
    declarations: [TeamAdminComponent],
    providers: [KumulosService],
})

export class TeamAdminModule {};