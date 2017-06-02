import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { MainAppComponent }        from './mainApp.component';
import { mainAppRouting}           from './mainApp.routing';
import { MainAppSectionComponent } from './mainAppSection.component';

@NgModule({
    imports: [mainAppRouting, CommonModule],
    declarations: [MainAppComponent, MainAppSectionComponent],
    providers: [],
})

export class MainAppModule {};