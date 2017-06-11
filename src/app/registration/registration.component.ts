import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidationService } from '../shared/services/validation.service';

@Component({
    selector: 'registration-page',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
}) 

export class RegistrationComponent implements OnInit  {

    registrationForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { };

    ngOnInit() {
        this.registrationForm = this.formBuilder.group({
            name: ['', Validators.required],
            jobTitle: ['', Validators.required],
            organization: ['', Validators.required],
            country: ['', Validators.required],
            email: ['', [Validators.required, ValidationService.emailValidator]],
            phone: ['', [Validators.required, ValidationService.phoneValidator]],
            userDetail: '',
        });
    }

    onSubmit() {
        console.log(this.registrationForm.value);
    }
}