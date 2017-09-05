import { Component } from '@angular/core';
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
