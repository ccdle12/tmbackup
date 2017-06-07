import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }       from '@angular/router';
import { FormsModule }        from '@angular/forms';
import { viewResultsRouting } from './viewResults.routing';

import { ViewResultsComponent } from './viewResults.component';

@NgModule({
  imports: [viewResultsRouting, CommonModule],
  declarations: [ViewResultsComponent],
  providers: [],
})
export class ViewResultsModule { }