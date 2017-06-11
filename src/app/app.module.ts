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
import { NotFoundComponent } from './not_found/notFound.component';
import { AuthCallbackComponent } from './authCallback/authCallback.component';

import { MdProgressSpinnerModule } from '@angular/material';
import { MdDialogModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, HttpModule, appRouting, MdProgressSpinnerModule, MdDialogModule],
  declarations: [AppComponent, WelcomeComponent, RegisterCityDialog, NotFoundComponent, AuthCallbackComponent],
  entryComponents: [RegisterCityDialog],
  providers: [AuthService, WelcomeGuardService, LocalStorageService, KumulosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
