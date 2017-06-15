import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { customerExperienceRouting } from './customerExperience.routing';
import { CustomerExperienceComponent } from './customerExperience.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, customerExperienceRouting, FormsModule],
  declarations: [CustomerExperienceComponent],
  providers: [],
  
})
export class CustomerExperienceModule { }