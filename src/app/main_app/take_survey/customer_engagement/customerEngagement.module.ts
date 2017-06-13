import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { customerEngagementRouting } from './customerEngagement.routing';
import { CustomerEngagementComponent } from './customerEngagement.component';

@NgModule({
  imports: [CommonModule, customerEngagementRouting],
  declarations: [CustomerEngagementComponent],
  providers: [],
  
})
export class CustomerEngagementModule { }