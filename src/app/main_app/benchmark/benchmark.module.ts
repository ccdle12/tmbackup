import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { benchmarkRouting } from './benchmark.routing';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';

import { BenchmarkComponent } from './benchmark.component';

@NgModule({
  imports: [benchmarkRouting, CommonModule, MdButtonModule, MdCheckboxModule],
  declarations: [BenchmarkComponent],
  providers: []
  
})
export class BenchmarkModule { }