import { Routes, RouterModule }    from '@angular/router';
import { ModuleWithProviders }     from '@angular/core'

import { MainAppComponent }        from './mainApp.component';
import { MainAppSectionComponent } from './mainAppSection.component';
import { AuthGuardService }        from '../shared/services/auth-guard.service';

const mainAppRoutes: Routes = [
    {
        path: '',
        component: MainAppSectionComponent,
        children: [
        {
            path: '',
            component: MainAppComponent
        },
        {
            path: 'teamadmin',
            loadChildren: './team_admin/teamAdmin.module#TeamAdminModule',
            canActivate: [AuthGuardService]
        },
        {
            path: 'takesurvey',
            loadChildren: './take_survey/takeSurvey.module#TakeSurveyModule'
        },
        {
            path: 'viewresults',
            loadChildren: './view_results/viewResults.module#ViewResultsModule'
        },
        {
            path: 'publication',
            loadChildren: './publication/publication.module#PublicationModule',
            canActivate: [AuthGuardService]
        },
        {
            path: 'benchmark',
            loadChildren: './benchmark/benchmark.module#BenchmarkModule',
            canActivate: [AuthGuardService]
        }
    ]
    }
]

export const mainAppRouting: ModuleWithProviders = RouterModule.forChild(mainAppRoutes); 