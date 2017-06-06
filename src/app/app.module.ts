import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AuthService }   from './shared/services/auth.service';

import { appRouting}             from './app.routing';
import { AppComponent }          from './app.component';
import { WelcomeComponent }      from './welcome/welcome.component';
import { NotFoundComponent }     from './not_found/notFound.component';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, appRouting],
  declarations: [AppComponent, WelcomeComponent, NotFoundComponent],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
