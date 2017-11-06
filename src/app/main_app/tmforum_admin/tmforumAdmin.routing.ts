import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { UserRoleGuardService } from '../../shared/services/userRole-guard.service';

import { TMForumAdminComponent } from './tmforumAdmin.component';
import { OrganizationAdminComponent } from './organization_admin/organizationAdmin.component'
import { SurveyAdminComponent } from './survey_admin/surveyAdmin.component'
import { UserAdminComponent } from './user_admin/userAdmin.component'
import { BulkInviteAdminComponent } from './bulk_invite_admin/bulkInviteAdmin.component'

const tmforumAdminRoutes: Routes = [
    {
        path: '',
        component: TMForumAdminComponent,
    },
    {
        path: 'organizationadmin',
        component: OrganizationAdminComponent,
    },
    {
        path: 'surveyadmin',
        component: SurveyAdminComponent,
    },
    {
        path: 'useradmin',
        component: UserAdminComponent,
    },
    {
        path: 'bulkinviteadmin',
        component: BulkInviteAdminComponent,
    }
    
    // },
    // {
    //     path: 'myownresults',
    //     component: MyOwnResultsComponent,
    // },
    // {
    //     path: 'organizationresults',
    //     component: OrganizationResultsComponent,
    //     canActivate: [UserRoleGuardService]
    // },
    // {
    //     path: 'teamdynamics',
    //     component: TeamDynamicsComponent,
    //     canActivate: [UserRoleGuardService]
    // },
    // {
    //     path: 'adjustaggregates',
    //     component: AdjustAggregatesComponent,
    
    // }
]   

export const tmforumAdminRouting: ModuleWithProviders = RouterModule.forChild(tmforumAdminRoutes); 