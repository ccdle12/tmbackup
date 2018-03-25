import { Injectable } from '@angular/core';
import {MatProgressSpinner} from '@angular/material';

@Injectable()
export class SpinnerService {
    
    constructor(spinner: MatProgressSpinner) { }

    public start(): void {
        
    }
}