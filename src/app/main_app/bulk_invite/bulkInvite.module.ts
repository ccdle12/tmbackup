import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BulkInviteRouting } from './bulkInvite.routing';
import { BulkInviteComponent } from './bulkInvite.component';
import {MatInputModule} from '@angular/material';

// import { ControlMessagesComponent } from '../shared/dialogs/controlMessages.component';
import { ValidationService } from '../../shared/services/validation.service';

@NgModule({
    imports: [BulkInviteRouting, CommonModule, FormsModule, ReactiveFormsModule, MatInputModule],
    declarations: [BulkInviteComponent], 
    providers: [ValidationService],
})

export class BulkInviteModule {};