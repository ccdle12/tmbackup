import { ModuleWithProviders }   from '@angular/core'
import { Routes, RouterModule }  from '@angular/router';
import { WelcomeComponent }      from './welcome/welcome.component';
import { RegistrationComponent } from './registration/registration.component';
import { NotFoundComponent}      from './not_found/notFound.component';
import { WelcomeGuardService }   from './shared/services/welcome-guard.service';
import { AuthGuardService }      from './shared/services/auth-guard.service';

import { MainAppModule}  from './main_app/mainApp.module'

const appRoutes: Routes = [
    {
        path: '', 
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'main',
        loadChildren: 'app/main_app/mainApp.module#MainAppModule',
        // canActivate: [AuthGuardService]
    },
    {
        path: 'registration',
        component: RegistrationComponent, 
    },
    {
        path: 'welcome',  
        component: WelcomeComponent, 
        canActivate: [WelcomeGuardService]
    },
    {path: '**', component: NotFoundComponent},
]

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);