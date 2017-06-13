import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { customerExperienceRouting } from './customerExperience.routing';
import { CustomerExperienceComponent } from './customerExperience.component';

@NgModule({
  imports: [CommonModule, customerExperienceRouting],
  declarations: [CustomerExperienceComponent],
  providers: [],
  
})
export class CustomerExperienceModule { }