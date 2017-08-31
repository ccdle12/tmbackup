import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
// import {} from "./SharedComponentA";
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';  

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

    ],
    declarations: [
      jqxGridComponent
    ],
    providers: [
    ],
    exports: [
      jqxGridComponent
    ]
})
export class CustomGridModule {}