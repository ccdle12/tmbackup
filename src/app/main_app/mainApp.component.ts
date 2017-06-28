import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { KumulosService } from '../shared/services/kumulos.service';

@Component({
    selector: 'mainApp-page',
    template:
    `   
    
    `
}) 

export class MainAppComponent{
    constructor(public authService: AuthService, public kumulosService: KumulosService) {}
 }