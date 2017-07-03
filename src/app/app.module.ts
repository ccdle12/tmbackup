import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService } from './shared/services/auth.service';
import { WelcomeGuardService } from './shared/services/welcome-guard.service';
import { LocalStorageService } from './shared/services/localStorage.service';
import { KumulosService} from './shared/services/kumulos.service';

import { appRouting } from './app.routing';
import { AppComponent } from './app.component';
import { WelcomeComponent, RegisterCityDialog } from './welcome/welcome.component';
import { SurveyComponent, RemindUserToSaveDialog, InDemoModeDialog, SaveSnackBarComponent } from './main_app/take_survey/survey_module/survey/survey.component';
import { NotFoundComponent } from './not_found/notFound.component';
import { AuthCallbackComponent } from './authCallback/authCallback.component';

import { EmailSentSnackBarComponent } from './main_app/view_results/my_own_results/myOwnResults.component';


import { MdProgressSpinnerModule, MdDialogModule, MdMenuModule, MdIconModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, HttpModule, appRouting, MdProgressSpinnerModule, MdDialogModule, MdMenuModule, MdIconModule],
  declarations: [AppComponent, WelcomeComponent, RegisterCityDialog, RemindUserToSaveDialog, InDemoModeDialog, NotFoundComponent, AuthCallbackComponent, SaveSnackBarComponent, EmailSentSnackBarComponent],
  entryComponents: [RegisterCityDialog, RemindUserToSaveDialog, InDemoModeDialog, SaveSnackBarComponent, EmailSentSnackBarComponent],
  providers: [AuthService, WelcomeGuardService, LocalStorageService, KumulosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
