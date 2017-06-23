import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { viewResultsRouting } from './viewResults.routing';
import { ViewResultsComponent } from './viewResults.component';
import { NvD3Component } from 'ng2-nvd3';

import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';
// import { NvD3Module } from 'ng2-nvd3/lib';

@NgModule({
  imports: [viewResultsRouting, CommonModule],
  declarations: [ViewResultsComponent, GoogleChart],
  providers: [],
})
export class ViewResultsModule { }