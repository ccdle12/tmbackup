import { Component } from '@angular/core';
<<<<<<< HEAD
import { KumulosService } from '../../shared/services/kumulos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'bulkInvite',
  templateUrl: './bulkInvite.component.html',
  styleUrls: ['./bulkInvite.component.css']
})
export class BulkInviteComponent 
{
    bulkInvite: FormGroup;

    constructor(public formBuilder: FormBuilder) 
    {
        this.bulkInvite = this.formBuilder.group({
            bulkEmails: ['', Validators.required],
        });
    }

    
}
=======
import { Router } from '@angular/router';
import { KumulosService } from '../../shared/services/kumulos.service';
import { AuthService } from '../../shared/services/auth.service';
import { MdSnackBar } from '@angular/material';
import { MdDialog } from '@angular/material';

import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';


@Component({
  selector: 'bulkInviteComponent',
  templateUrl: './bulkInvite.component.html',
  styleUrls: ['./bulkInvite.component.css']
})
export class BulkInviteComponent { }
>>>>>>> basic
