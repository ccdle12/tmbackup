import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerEngagementComponent } from './customerEngagement.component';

const customerEngagementRoutes: Routes = [
    {
        path: '',
        component: CustomerEngagementComponent,
    },                                                                     
]   

export const customerEngagementRouting: ModuleWithProviders = RouterModule.forChild(customerEngagementRoutes); 