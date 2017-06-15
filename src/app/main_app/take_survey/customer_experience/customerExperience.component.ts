import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'customerExperience',
  templateUrl: './customerExperience.component.html',
  styleUrls: ['./customerExperience.component.css']
})
export class CustomerExperienceComponent {
  constructor(public router: Router) { 
    this.router.navigateByUrl('/main/takesurvey/customerexperience/survey');
  }
}
