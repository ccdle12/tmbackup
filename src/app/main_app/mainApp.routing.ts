import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { MainAppComponent } from './mainApp.component';
import { BulkInviteComponent } from './bulk_invite/bulkInvite.component';
import { MainAppSectionComponent } from './mainAppSection.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { UserRoleGuardService } from '../shared/services/userRole-guard.service';

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
            path: 'landingpage',
            loadChildren: './landing_page/landingPage.module#LandingPageModule',
            canActivate: [AuthGuardService],
        },
        {
            path: 'teamadmin',
            loadChildren: './team_admin/teamAdmin.module#TeamAdminModule',
            canActivate: [UserRoleGuardService, AuthGuardService],
        },
        {
            path: 'takesurvey',
            loadChildren: './take_survey/takeSurvey.module#TakeSurveyModule',
            canActivate: [AuthGuardService],
        },
        {
            path: 'viewresults',
            loadChildren: './view_results/viewResults.module#ViewResultsModule',
            canActivate: [AuthGuardService],
        },
        {
            path: 'publication',
            loadChildren: './publication/publication.module#PublicationModule',
            canActivate: [UserRoleGuardService, AuthGuardService],
        },
        {
            path: 'benchmark',
            loadChildren: './benchmark/benchmark.module#BenchmarkModule',
            canActivate: [UserRoleGuardService, AuthGuardService],
        },
        {
            path: 'bulkinvite',
            loadChildren: './bulk_invite/bulkInvite.module#BulkInviteModule',
        }
        // {
        //     path: 'bulkinvite',
        //     component: BulkInviteComponent
        // }
    ],
    }
]

export const mainAppRouting: ModuleWithProviders = RouterModule.forChild(mainAppRoutes); 