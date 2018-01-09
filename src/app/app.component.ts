import { Component, OnInit } from '@angular/core';
import { AuthService }       from './shared/services/auth.service';
import { LocalStorageService } from './shared/services/localStorage.service';
import { KumulosService } from './shared/services/kumulos.service';
import { EditRoleService } from './shared/services/editRole.service';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';

import {NgZone, Renderer, ElementRef, ViewChild} from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

    public infoTooltip: string;
    public width: any;
    public height: any;
    public userDetails: string;

  // Instead of holding a boolean value for whether the spinner
    // should show or not, we store a reference to the spinner element,
    // see template snippet below this script
    @ViewChild('spinnerElement') spinnerElement: ElementRef;

   constructor(private router: Router,  private ngZone: NgZone,
               private renderer: Renderer, public authService: AuthService, 
               public localStorageService: LocalStorageService, 
               public dialog: MatDialog) {

        this.authService.handleAuthentication();
        this.authService.revertToDemoIfTokenExpires();
        this.inSeeDemo();

        this.setWidthAndHeight();

        this.infoTooltip = "TM Forum Digial Maturity Model and Metrics. v1.0 UAT (build. 1.0.0.2). 2017 Cotham Technologies and TM Forum. In-app iocs by Icons8 (https://icons8.com/)."
        
        this.routerEventListener();
    
        
    }

    private setWidthAndHeight(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    private routerEventListener() {
        this.router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });
    }


    // Shows and hides the loading spinner during RouterEvent changes
    private navigationInterceptor(event: RouterEvent): void {
       if (event instanceof NavigationStart) {

            // We want to run this function outside of Angular's zone to
            // bypass change detection
            this.ngZone.runOutsideAngular(() => {

                // For simplicity we are going to turn opacity on / off
                // you could add/remove a class for more advanced styling
                // and enter/leave animation of the spinner
                this.renderer.setElementStyle(
                    this.spinnerElement.nativeElement,
                    'opacity',
                    '1'
                );
            });
        }

        if (event instanceof NavigationEnd) {
            this.hideSpinner();
        }

        // Set loading state to false in both of the below events to
        // hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this.hideSpinner();
        }

        if (event instanceof NavigationError) {
            this.hideSpinner();
        }
    }

    private hideSpinner(): void {

        // We wanna run this function outside of Angular's zone to
        // bypass change detection, 
        this.ngZone.runOutsideAngular(() => {

            // For simplicity we are going to turn opacity on / off
            // you could add/remove a class for more advanced styling
            // and enter/leave animation of the spinner
            this.renderer.setElementStyle(
                this.spinnerElement.nativeElement,
                'opacity',
                '0'
            );
        });
    }



    public inSeeDemo(): boolean {
        let urlLocation = window.location.pathname;
        let urlRegex = '\/main\/?|\/main\/.*';
        
        return !this.authService.isAuthenticated() && urlLocation.match(urlRegex) ? true : false;
    }

    public editUserDetails(): void {
        let dialogRef = this.dialog.open(EditUserDetailsDialog);


    }

    public minWidth() {
        if (this.width < 600) {
            return false;
        }

        return true;
    }

    public showDisclaimer(): boolean {
        let currentUrl: string = window.location.pathname;

        return currentUrl === "/welcome" ? true: false;
    }

    public getUserAvatar(): any {
        var userAvatar;

        if (this.authService.isAuthenticated() && localStorage.getItem('userPicture')) {
            userAvatar = JSON.parse(localStorage.getItem('userPicture')); 
        } else {
            userAvatar = '../assets/default_avatar.png';
        }

        return userAvatar;
    }

}

@Component({
  selector: 'editUserDetailDialog',
  templateUrl: './shared/dialogs/editUserDetailDialog.html',
  styleUrls: ['./shared/dialogs/editUserDetailDialog.css']
})
export class EditUserDetailsDialog {

  userName: string;
  userTitle: string;
  surveyGroup: string;

  /** Survey Groups that will allow Organization Admins to switch between */
  surveyGroupObjects: Array<any>;
  namesOfSurveyGroups: Array<string>;
  mapOfSurveyGroupNameToIndexPostion: Map<any, any>;
  currentSurveyGroup: any;
//   positionOfCurrentSurveyGroup: any;


  /** Trying to use form groups */
  public editUserDetailsForm: FormGroup;

  httpRequestFlag: boolean;
  
  @ViewChild('spinnerElement') loadingElement: ElementRef;

  constructor(public kumulosService: KumulosService, 
              public authService: AuthService,  
              public dialog: MatDialog, 
              public userJSON: EditRoleService,
              public formBuilder: FormBuilder,) { 
    this.setupInstanceVariables();
    this.getSurveyGroupsInOrg();  
    this.setUserNameAndTitle();
  }

  public setupInstanceVariables() {
      this.initEditUserDetailsForm();
      this.mapOfSurveyGroupNameToIndexPostion = new Map();
      this.surveyGroupObjects = new Array();
      this.namesOfSurveyGroups = new Array();
  }

  private initEditUserDetailsForm(): void 
  {
    this.editUserDetailsForm = this.formBuilder.group({
      name: [this.getUserName()],
      jobTitle: [this.getUserTitle()],
      surveyGroup: [this.getUserCity()],
     });
  }

  public getSurveyGroupsInOrg(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    let cityId = user["city_id"];
    
    this.kumulosService.webGetOrgbyCityID(cityId)
        .toPromise().then(response => {
            //Retrieving org by city id
            // returning the org object
            return response.payload;
        }).then(payload => {
            //getting the org name from the org object
            let orgName = payload["name"];

            //passing the org name to get all the survey groups associated with it 
            this.kumulosService.webGetSurveysByOrg(orgName).toPromise()
                .then(response => {

                    //Adding all the survey groups to a cached array for displaying on the view
                    for (let i = 0; i < response.payload.length; i++) {
                        this.surveyGroupObjects.push(response.payload[i]);
                        this.namesOfSurveyGroups.push(response.payload[i]["name"])

                        // Mapping name of each survey group to it's index position
                        this.mapOfSurveyGroupNameToIndexPostion.set(response.payload[i]["name"], i);

                        // Setting current survey group according to the city_id
                        if (cityId == response.payload[i]["cityID"]) {
                            this.currentSurveyGroup = response.payload[i];
                        }
                    }
                });

        });
  }

  public setUserNameAndTitle(): void {
    this.userName = this.getUserName();
    this.userTitle = this.getUserTitle();
  }

  public updateUserDetails(): void {
    let userId: string = this.getUserId();

    this.httpRequestFlag = true;

    //Retrieving selected survey group
    let cityId;
    let surveyGroupName;

    if (this.editUserDetailsForm.value.surveyGroup) {
        surveyGroupName = this.editUserDetailsForm.value.surveyGroup
        let indexPosition = this.mapOfSurveyGroupNameToIndexPostion.get(surveyGroupName);

        let selectedSurveyGroupObject = this.surveyGroupObjects[indexPosition];

        cityId = selectedSurveyGroupObject["cityID"];
    } else {
        cityId = "";
        surveyGroupName = "";
    }

    // User name and User title
    let userName = this.editUserDetailsForm.value.name;
    let userTitle = this.editUserDetailsForm.value.jobTitle;

    // console.log("user name");
    // console.log(userName)
    // console.log("user title")
    // console.log(userTitle)
 
    this.kumulosService.updateUserNameAndJobTitle(userId, userName, userTitle, cityId, surveyGroupName,)
        .subscribe(responseJSON => 
        {
            console.log(responseJSON.payload);
            this.updateUserProfile();
        });
  }

  private getUserId(): string {
    let userProfile: JSON = this.getUserProfile();
    return userProfile['user_id'];
  }

  private getUserName(): string {
    let userProfile: JSON = this.getUserProfile();

    if (this.isUserMetaData(userProfile)) {
        if (this.isMetaDataNameEmpty(userProfile)) {
            return userProfile['name'];
        } else {
            return userProfile['user_metadata']['name'];
        }
    }

    return "";
  }

  private getUserTitle(): string {
      let userProfile: JSON = this.getUserProfile();
      console.log(userProfile);
      if (this.isUserMetaData(userProfile)) {
        if (this.isMetaDataNameEmpty(userProfile)) {
            return "";
        } else {
            return userProfile['user_metadata']['jobTitle'];
        }
    }

    return "";
  }

  private getUserCity(): string {
      let user = JSON.parse(localStorage.getItem('user'));

      return user["city"];
  }

  private getUserProfile(): JSON {
    let parsedUserProfile: JSON = JSON.parse(localStorage.getItem('userProfile')); 
    return parsedUserProfile;
  }

  private isUserMetaData(userProfile: JSON): boolean {
    return userProfile['user_metadata'] ? true : false;
  }

  private isMetaDataNameEmpty(userProfile: JSON): boolean {
      return userProfile['user_metadata']['name'] ? false : true;
  }


  private updateUserProfile(): void {
    this.requestUpdatedUserProfile();
  }

  private requestUpdatedUserProfile(): void {
      let userId: string = this.getUserId();
      
      this.kumulosService.getUserProfile(userId)
        .subscribe(responseJSON => 
        {
            let userProfile = JSON.stringify(responseJSON.payload);
            this.cacheUserProfile(userProfile);
            this.cacheUserName(userProfile);
            this.dialog.closeAll();
            
        });
  }

  private cacheUserProfile(userProfile: string): void {
    localStorage.setItem('userProfile', userProfile);
  }

  private cacheUserName(userProfile: string): void {
    let userName: string = this.getUserName();
    localStorage.setItem('userName', userName);
  }

  private reloadPage(): void {
      window.location.reload();
  }

  onSubmit() {}
}
