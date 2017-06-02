import { Routes, RouterModule }    from '@angular/router';
import { ModuleWithProviders }     from '@angular/core'

import { MainAppComponent }        from './mainApp.component';
import { MainAppSectionComponent } from './mainAppSection.component';

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
            loadChildren: './team_admin/teamAdmin.module#TeamAdminModule'
        }
    ]
    }
]

export const mainAppRouting: ModuleWithProviders = RouterModule.forChild(mainAppRoutes); 