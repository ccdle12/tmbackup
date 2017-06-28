import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'organizationResultsComponent',
  templateUrl: './organizationResults.component.html',
  styleUrls: ['./organizationResults.component.css']
})
export class OrganizationResultsComponent { 

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

  
  public comboChartData: any =  {
    chartType: 'ComboChart',
    dataTable: [
      ['Month',    'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Average', 'Test 5', 'TEST 6' ],
      ['Customer',    1,          2,         3,               4,              5,          1,      1,     ],
      ['Strategy',    1,          2,         3,               4,              5,          2,      2,     ],
      ['Technology',  1,          2,         3,               4,              5,          3,      3,     ],
      ['Operations',  1,          2,         3,               4,              5,          4,      4,     ],
      ['Culture',     1,          2,         3,               4,              5,          5,      5,     ]
    ],
    options: {
      // title : 'Monthly Coffee Production by Country',
      // vAxis: {title: 'Cups'},
      // hAxis: {title: 'Month'},
      seriesType: 'bars',
      // series: {5: {type: 'line'}}
    }
  };
}