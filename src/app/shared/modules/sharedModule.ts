import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

// import {} from "./SharedComponentA";
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
// import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';  

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

    ],
    declarations: [
      jqxSliderComponent,
      // jqxGridComponent
    ],
    providers: [
    ],
    exports: [
      jqxSliderComponent,
      // jqxGridComponent
    ]
})
export class SharedModule {}