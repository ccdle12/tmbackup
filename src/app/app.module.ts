import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, PlatformRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService, LicenseInvalidDialog } from './shared/services/auth.service';
import { WelcomeGuardService } from './shared/services/welcome-guard.service';
import { UserSaveGuardService } from './shared/services/userSave-guard.service';
import { LocalStorageService } from './shared/services/localStorage.service';
import { KumulosService} from './shared/services/kumulos.service';
import { CreateAndDeleteDimensionOwnerService } from './shared/services/createAndDeleteDimensionOwner.service';

import { appRouting } from './app.routing';
import { AppComponent } from './app.component';
import { WelcomeComponent, RegisterCityDialog } from './welcome/welcome.component';
import { EvidenceDialog, DeleteEvidenceDialog, EditEvidenceDialog  } from './main_app/take_survey/survey_module/evidence/evidence.component';
import { SurveyComponent, RemindUserToSaveDialog, InDemoModeDialog, SaveSnackBarComponent, ResponsibleForSectionDialog, RemoveResponsibilityForSectionDialog  } from './main_app/take_survey/survey_module/survey/survey.component';
import { EmailInvalidDialog, SuccessBulkInviteDialog } from './main_app/bulk_invite/bulkInvite.component';
import { NotFoundComponent } from './not_found/notFound.component';
import { AuthCallbackComponent } from './authCallback/authCallback.component';

import { EmailBenchmarkResults  } from './main_app/benchmark/benchmark.component';

import { EmailSentSnackBarComponent, EmailMyOwnResultsDialog } from './main_app/view_results/my_own_results/myOwnResults.component';
import { EditUserDetailsDialog } from './app.component';
import { InviteUserDialog, DeleteUserDialog, EditUserRole } from './main_app/team_admin/teamAdmin.component';
import { ReactiveFormsModule } from '@angular/forms';

import {AppMaterialModules} from './material.module';

import { ControlMessagesComponent } from './shared/dialogs/controlMessages.component';

import { DeleteUserService } from './shared/services/deleteUser.service';
import { EditRoleService } from './shared/services/editRole.service';
import { EvidenceService } from './shared/services/evidence.service';
import { UserSavedService } from './shared/services/userSaved.service'; 
import { EmailTeamDynamicsDialog } from './main_app/view_results/team_dynamics/teamDynamics.component';
import { EmailOrganizationResultsDialog } from './main_app/view_results/our_organization_results/organizationResults.component'; 
import { AdjustAggregatesDialog } from './main_app/view_results/our_organization_results/organizationResults.component'; 
import { UpdatePublicationLevelDialog, PublishSurveyDialog, SelectCityOrgDialog } from './main_app/publication/publication.component';
import { DropdownModule } from 'primeng/primeng';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { SharedModule } from './shared/modules/sharedModule';
import { LoadingSnackBar } from './shared/components/loadingSnackBar';
import { SavingSnackBar } from './shared/components/savingSnackBar';

import { UserRoleGuardService } from './shared/services/userRole-guard.service';
import { LicenseService } from './shared/services/license.service';

import { AddNewOrgDialog, EditOrgDialog } from './main_app/tmforum_admin/organization_admin/organizationAdmin.component';
import { AddCompanyDialog, EditCompanyDialog } from './main_app/tmforum_admin/survey_admin/surveyAdmin.component';
import { AdminInviteUserDialog, AdminEditUserRoleDialog } from './main_app/tmforum_admin/user_admin/userAdmin.component';
import {PublishedDataEmailResultsDialog} from './main_app/tmforum_admin/published_data_admin/publishedDataAdmin.component'
// import { HeatMapComponent } from './main_app/view_results/heat_map/heatMap.component';

@NgModule({
  imports: 
  [
    AppMaterialModules, 
    BrowserAnimationsModule, 
    SharedModule, 
    BrowserModule, 
    FormsModule, 
    ReactiveFormsModule, 
    HttpModule, 
    appRouting, 
    DropdownModule
  ],
  declarations: 
  [
    AppComponent, 
    WelcomeComponent, 
    RegisterCityDialog, 
    RemindUserToSaveDialog, 
    InDemoModeDialog, 
    ResponsibleForSectionDialog, 
    RemoveResponsibilityForSectionDialog , 
    NotFoundComponent, 
    AuthCallbackComponent, 
    EmailInvalidDialog, 
    SuccessBulkInviteDialog, 
    SaveSnackBarComponent, 
    EmailSentSnackBarComponent, 
    UpdatePublicationLevelDialog, 
    EditUserDetailsDialog, 
    InviteUserDialog, 
    DeleteUserDialog,
    EditUserRole, 
    ControlMessagesComponent, 
    EmailMyOwnResultsDialog, 
    EmailTeamDynamicsDialog, 
    EmailOrganizationResultsDialog, 
    LicenseInvalidDialog, 
    EvidenceDialog, 
    DeleteEvidenceDialog,
    EditEvidenceDialog, 
    EmailBenchmarkResults, 
    AdjustAggregatesDialog, 
    PublishSurveyDialog, 
    SelectCityOrgDialog,
    AddNewOrgDialog,
    EditOrgDialog,
    EditCompanyDialog,
    AddCompanyDialog,
    AdminInviteUserDialog,
    AdminEditUserRoleDialog,
    PublishedDataEmailResultsDialog,
    // HeatMapComponent,
  ],
  entryComponents: 
  [
    UpdatePublicationLevelDialog, 
    EmailInvalidDialog, 
    SuccessBulkInviteDialog, 
    RegisterCityDialog, 
    RemindUserToSaveDialog, 
    InDemoModeDialog, 
    ResponsibleForSectionDialog, 
    RemoveResponsibilityForSectionDialog,
    SaveSnackBarComponent, 
    EmailSentSnackBarComponent, 
    EditUserDetailsDialog, 
    InviteUserDialog, 
    DeleteUserDialog, 
    EditUserRole, 
    EmailMyOwnResultsDialog, 
    EmailTeamDynamicsDialog, 
    EmailOrganizationResultsDialog, 
    LicenseInvalidDialog, 
    EvidenceDialog, 
    DeleteEvidenceDialog,
    EditEvidenceDialog, 
    EmailBenchmarkResults, 
    AdjustAggregatesDialog, 
    PublishSurveyDialog, 
    SelectCityOrgDialog, 
    AddNewOrgDialog,
    EditOrgDialog,
    EditCompanyDialog,
    AddCompanyDialog,
    AdminInviteUserDialog,
    AdminEditUserRoleDialog,
    PublishedDataEmailResultsDialog,
  ],
  providers: 
  [
    AuthService, 
    LicenseService, 
    UserRoleGuardService, 
    LoadingSnackBar, 
    SavingSnackBar, 
    WelcomeGuardService, 
    UserSaveGuardService, 
    LocalStorageService, 
    KumulosService, 
    DeleteUserService, 
    UserSavedService, 
    EditRoleService, 
    CreateAndDeleteDimensionOwnerService, 
    EvidenceService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
