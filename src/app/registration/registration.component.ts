import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
            jobTitle: '',
            organization: '',
            country: '',
            email: '',
            phone: '',
            userDetail: '',
        });
    }

    onSubmit() {
        console.log(this.registrationForm.value);
    }
}