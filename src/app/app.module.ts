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
import { CustomerEngagementSurveyComponent, RemindUserToSaveDialog } from './main_app/take_survey/customer_engagement/survey/customerEngagementSurvey.component';
import { NotFoundComponent } from './not_found/notFound.component';
import { AuthCallbackComponent } from './authCallback/authCallback.component';

import { MdProgressSpinnerModule, MdDialogModule, MdMenuModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, HttpModule, appRouting, MdProgressSpinnerModule, MdDialogModule, MdMenuModule],
  declarations: [AppComponent, WelcomeComponent, RegisterCityDialog, RemindUserToSaveDialog, NotFoundComponent, AuthCallbackComponent],
  entryComponents: [RegisterCityDialog, RemindUserToSaveDialog],
  providers: [AuthService, WelcomeGuardService, LocalStorageService, KumulosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
