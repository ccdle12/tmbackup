import { Component  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'customerEngagement',
  templateUrl: './customerEngagement.component.html',
  styleUrls: ['./customerEngagement.component.css']
})
export class CustomerEngagementComponent {

    constructor(public router: Router) { 
          this.router.navigateByUrl('/main/takesurvey/customerengagement/survey');
    }  
}
