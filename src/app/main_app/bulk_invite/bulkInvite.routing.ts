import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { BulkInviteComponent } from './bulkInvite.component';

const bulkInviteRoutes: Routes = [
    {
        path: '',
        component: BulkInviteComponent,

    }                                                                           
]   

export const BulkInviteRouting: ModuleWithProviders = RouterModule.forChild(bulkInviteRoutes); 