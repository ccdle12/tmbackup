import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { KumulosService } from '../shared/services/kumulos.service';
import { Router } from '@angular/router';

@Component({
    selector: 'mainApp-page',
    styleUrls: ['./mainApp.component.css'],
    template:
    `   
    <div class="marginBottomMainApp"></div>
    `
}) 

export class MainAppComponent{
    constructor(public authService: AuthService, public kumulosService: KumulosService,
                public router: Router) {
        this.router.navigateByUrl('/main/takesurvey');
    }
 }