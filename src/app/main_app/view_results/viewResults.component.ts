import { Component } from '@angular/core';

@Component({
  selector: 'app-takesurvey',
  templateUrl: './viewResults.component.html',
  styleUrls: ['./viewResults.component.css']
})
export class ViewResultsComponent {
  constructor() { }

    public candle_ChartData = [
        ['Day', 'Low', 'Opening value', 'Closing value', 'High'],
        ['Mon', 28, 32, 50, 68],
        ['Tue', 38, 38, 55, 55],
        ['Wed', 55, 55, 77, 77],
        ['Thu', 77, 77, 66, 66],
        ['Fri', 66, 66, 22, 22]
    ];

    public candle_ChartOptions = {
        legend: 'none',
        bar: { groupWidth: '100%' }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
            risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
        }
    };
}
