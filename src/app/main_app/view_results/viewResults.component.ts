import { Component, OnInit } from '@angular/core';
// declare let d3: any;

import * as d3 from 'd3';

import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';

@Component({
  selector: 'app-takesurvey',
  templateUrl: './viewResults.component.html',
  styleUrls: ['./viewResults.component.css']
})
export class ViewResultsComponent {

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