import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'myOwnResultsComponent',
  templateUrl: './myOwnResults.component.html',
  styleUrls: ['./myOwnResults.component.css']
})
export class MyOwnResultsComponent { 

  constructor(public router: Router) {
    console.log('MY OWN RESULTS CONSTRUCTED');
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

    public backToDashboard(): void {
    window.location.reload();
    this.router.navigateByUrl('/main');
  }

  
  public comboChartData: any =  {
    chartType: 'ComboChart',
    dataTable: [
      ['SurveyData',          'Importance',  'As-Is', '2 Year Target' ],
      ['Customer Engagement',       1,             2,         3       ],
      ['Customer Experience',       1,             2,         3       ],
      ['Tech',                      1,             2,         3       ],
      ['Operations',                1,             2,         3       ],
      ['Culture',                   1,             2,         3       ]
    ],
    options: {
      title : 'Customer',
      // vAxis: {title: 'Cups'},
      // hAxis: {title: 'Month'},
      seriesType: 'bars',
      // series: {5: {type: 'line'}}
    }
  };
}