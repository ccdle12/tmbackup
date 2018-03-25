import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

    ],
    declarations: [
      jqxSliderComponent,
    ],
    providers: [
    ],
    exports: [
      jqxSliderComponent,
    ]
})
export class SharedModule {}