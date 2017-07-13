import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService } from './shared/services/auth.service';
import { WelcomeGuardService } from './shared/services/welcome-guard.service';
import { UserSaveGuardService } from './shared/services/userSave-guard.service';
import { LocalStorageService } from './shared/services/localStorage.service';
import { KumulosService} from './shared/services/kumulos.service';

import { appRouting } from './app.routing';
import { AppComponent } from './app.component';
import { WelcomeComponent, RegisterCityDialog } from './welcome/welcome.component';
import { SurveyComponent, RemindUserToSaveDialog, InDemoModeDialog, SaveSnackBarComponent } from './main_app/take_survey/survey_module/survey/survey.component';
import { NotFoundComponent } from './not_found/notFound.component';
import { AuthCallbackComponent } from './authCallback/authCallback.component';

import { EmailSentSnackBarComponent, EmailMyOwnResultsDialog } from './main_app/view_results/my_own_results/myOwnResults.component';
import { MdProgressSpinnerModule, MdDialogModule, MdMenuModule, MdIconModule, MdInputModule, MdButtonModule, MdSelectModule, MdSliderModule} from '@angular/material';
import { EditUserDetailsDialog } from './app.component';
import { InviteUserDialog, DeleteUserDialog } from './main_app/team_admin/teamAdmin.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ControlMessagesComponent } from './shared/dialogs/controlMessages.component';

import { DeleteUserService } from './shared/services/deleteUser.service';
import { UserSavedService } from './shared/services/userSaved.service'; 
import { EmailTeamDynamicsDialog } from './main_app/view_results/team_dynamics/teamDynamics.component';
import { EmailOrganizationResultsDialog } from './main_app/view_results/our_organization_results/organizationResults.component' 



@NgModule({
  imports: [BrowserAnimationsModule, BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, appRouting, MdProgressSpinnerModule, MdDialogModule, MdMenuModule, MdIconModule, MdInputModule, MdButtonModule, MdSelectModule, MdSliderModule],
  declarations: [AppComponent, WelcomeComponent, RegisterCityDialog, RemindUserToSaveDialog, InDemoModeDialog, NotFoundComponent, AuthCallbackComponent, 
                 SaveSnackBarComponent, EmailSentSnackBarComponent, EditUserDetailsDialog, InviteUserDialog, DeleteUserDialog, ControlMessagesComponent, EmailMyOwnResultsDialog, EmailTeamDynamicsDialog, EmailOrganizationResultsDialog],
  entryComponents: [RegisterCityDialog, RemindUserToSaveDialog, InDemoModeDialog, SaveSnackBarComponent, EmailSentSnackBarComponent, EditUserDetailsDialog, InviteUserDialog, DeleteUserDialog, EmailMyOwnResultsDialog, EmailTeamDynamicsDialog, EmailOrganizationResultsDialog],
  providers: [AuthService, WelcomeGuardService, UserSaveGuardService, LocalStorageService, KumulosService, DeleteUserService, UserSavedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
