import { Component }   from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router }      from '@angular/router';
import { KumulosService } from '../shared/services/kumulos.service';
import { StylingService } from '../shared/services/styling.service';

@Component({
    templateUrl: './mainAppSection.component.html',
    styleUrls: ['./mainApp.component.css']
})

export class MainAppSectionComponent {

    constructor(public authService: AuthService, 
                private router: Router, 
                public kumulosService: KumulosService,
                public stylingService: StylingService) {

     }



    public hideNavBar(): boolean {
        let currentUrl: string = this.router.url;

        let urlRegexTakeSurvey: string = '(\/takesurvey\/.*)';
        let urlRegexViewResults: string = '(\/viewresults\/*)';
        let urlRegexTMForumAdmin: string = '(\/tmforumadmin\/*)';

        if (currentUrl.match(urlRegexTakeSurvey) || currentUrl.match(urlRegexViewResults) || currentUrl.match(urlRegexTMForumAdmin)) {
            return false;
        }

        return true;
    }

    public activeBackgroundColor(urlNavigationBtn: string) {
        let currentUrl: string = window.location.pathname;

  
        return { 'background-color': '#62B3D1',
                  'color': 'white' };
        
    }

    public inTeamAdmin() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/teamadmin") {
            return { 'background-color': this.stylingService.getPrimaryColour('red'),
                  'color': 'white' };    
        } 
    }

    public currentUrlInTeamAdmin()
    {
        let currentUrl: string = window.location.pathname;

        return (currentUrl === "/main/teamadmin")
    }

    public inSurvey() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/takesurvey") {
            return { 'background-color': this.stylingService.getPrimaryColour('red'),
                  'color': 'white' };    
        } 
    }

    public inViewResults() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/viewresults") {
            return { 'background-color': '#469ac0',
                  'color': 'white' };    
        } 
 
    }

    public inPublication() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/publication") {
            return { 'background-color': this.stylingService.getPrimaryColour('red'),
                  'color': 'white' };    
        } 
    }

    public inBenchmark() {
        let currentUrl: string = window.location.pathname;

        if (currentUrl ===  "/main/benchmark") {
            return { 'background-color': this.stylingService.getPrimaryColour('red'),
                  'color': 'white' };    
        } 
    }

    public navStyle() 
    {
        return {'background-color': this.stylingService.getPrimaryColour('grey')}
    }


};