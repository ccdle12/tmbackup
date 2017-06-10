import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { registrationRouting } from './registration.routing';
import { RegistrationComponent } from './registration.component';

@NgModule({
    imports: [registrationRouting, CommonModule, ReactiveFormsModule],
    declarations: [RegistrationComponent],
    providers: [],
})

export class RegistrationModule {};