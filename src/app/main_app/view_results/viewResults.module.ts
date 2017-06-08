import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }       from '@angular/router';
import { FormsModule }        from '@angular/forms';
import { viewResultsRouting } from './viewResults.routing';

import { ViewResultsComponent } from './viewResults.component';

import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';

@NgModule({
  imports: [viewResultsRouting, CommonModule],
  declarations: [ViewResultsComponent, GoogleChart],
  providers: [],
})
export class ViewResultsModule { }