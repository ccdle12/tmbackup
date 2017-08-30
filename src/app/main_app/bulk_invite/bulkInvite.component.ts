import { Component } from '@angular/core';
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