import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { UserRoleGuardService } from '../../shared/services/userRole-guard.service';

import { TMForumAdminComponent } from './tmforumAdmin.component';
import { OrganizationAdminComponent } from './organization_admin/organizationAdmin.component'

const tmforumAdminRoutes: Routes = [
    {
        path: '',
        component: TMForumAdminComponent,
    },
    {
        path: 'organizationadmin',
        component: OrganizationAdminComponent,
    },
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