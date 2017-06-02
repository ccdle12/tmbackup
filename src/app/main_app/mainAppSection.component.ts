import { Component } from '@angular/core';

@Component({
    template: 
    `<div class="btn-group btn-group-justified navigationButtons">
        <a routerLink="teamadmin"   class="btn btn-primary">Team Admin</a>
        <a routerLink="takeSurvey"  class="btn btn-primary">Take Survey</a>
        <a routerLink="viewResults" class="btn btn-primary">View Results</a>
        <a routerLink="/" class="btn btn-primary">Publish</a>
        <a routerLink="/" class="btn btn-primary">Benchmark</a>
    </div>
        <router-outlet></router-outlet>
    `
})

export class MainAppSectionComponent {};