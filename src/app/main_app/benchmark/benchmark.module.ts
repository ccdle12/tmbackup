import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { benchmarkRouting } from './benchmark.routing';

import { BenchmarkComponent } from './benchmark.component';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { DropdownModule } from 'primeng/primeng';

import { MdTooltipModule} from '@angular/material';

@NgModule({
  imports: [benchmarkRouting, CommonModule, MdTooltipModule, Ng2GoogleChartsModule, DropdownModule, FormsModule, ReactiveFormsModule],
  declarations: [BenchmarkComponent],
  providers: []
  
})
export class BenchmarkModule { }