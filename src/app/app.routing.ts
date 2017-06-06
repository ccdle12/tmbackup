import { ModuleWithProviders }   from '@angular/core'
import { Routes, RouterModule }  from '@angular/router';
import { HomeComponent }         from './home/home.component';
import { WelcomeComponent }      from './welcome/welcome.component';
import { NotFoundComponent}      from './not_found/notFound.component';
import { WelcomeGuardService }   from './shared/services/welcome-guard.service';

import { MainAppModule}  from './main_app/mainApp.module'

const appRoutes: Routes = [
    {
        path: '', 
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'main',
        loadChildren: 'app/main_app/mainApp.module#MainAppModule'
    },
    {
        path: 'welcome',  
        component: WelcomeComponent, 
        canActivate: [WelcomeGuardService]
    },
    {path: '**', component: NotFoundComponent},
]

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);