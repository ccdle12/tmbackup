import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'teamDynamicsComponent',
  templateUrl: './teamDynamics.component.html',
  styleUrls: ['./teamDynamics.component.css']
})
export class TeamDynamicsComponent { 

  constructor(public router: Router) {
    console.log('ORGANIZATION RESULTS CONSTRUCTED');
  }

   public backToDashboard(): void {
    window.location.reload();
    this.router.navigateByUrl('/main');
  }

  public activeBackgroundColor() {
        return { 'background-color': '#1e90ff',
                  'color': 'white' };
    }

  public routeToPage(surveyPage: String) {
    console.log('routetoPage activated: ' + surveyPage);
    switch(surveyPage) {
      case('myownresults'):
        this.router.navigateByUrl('main/viewresults/myownresults');
        break;
      case ('organizationresults'):
        this.router.navigateByUrl('main/viewresults/organizationresults');
        break;
      case ('teamdynamics'):
        this.router.navigateByUrl('main/viewresults/teamdynamics');
        break;
      }
    }

    public candle_ChartData = [
        ['Sections', 'Low', 'Opening value', 'Closing value', 'High'],
        ['1.1.1', 1, 1.2, 3, 3],
        ['1.1.2', 1, 1.2, 4, 4.2],
        ['1.1.3', 1, 1.2, 4, 4.2],
        ['1.1.4', 1, 1.2, 4, 4.2],
        ['1.1.5', 1, 1.2, 4, 4.2]
    ];

    public candle_ChartOptions = {
        legend: 'none',
        bar: { groupWidth: '25%' }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#A9A9A9' }, // red
            risingColor: { strokeWidth: 0, fill: '#A9A9A9' }   // green
        }
    };
  
}