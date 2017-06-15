import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { customerEngagementRouting } from './customerEngagement.routing';
import { CustomerEngagementComponent } from './customerEngagement.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, customerEngagementRouting, FormsModule],
  declarations: [CustomerEngagementComponent],
  providers: [],
  
})
export class CustomerEngagementModule { }