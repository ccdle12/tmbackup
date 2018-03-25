import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainAppComponent } from './mainApp.component';
import { mainAppRouting } from './mainApp.routing';
import { MainAppSectionComponent } from './mainAppSection.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { KumulosService } from '../shared/services/kumulos.service';
import { MatTabsModule } from '@angular/material';
import {MatInputModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [mainAppRouting, CommonModule, MatTabsModule],
    declarations: [MainAppComponent, MainAppSectionComponent],
    providers: [AuthGuardService, KumulosService],
})

export class MainAppModule {};