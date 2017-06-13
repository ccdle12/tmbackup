import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerExperienceComponent } from './customerExperience.component';

const customerExperienceRoutes: Routes = [
    {
        path: '',
        component: CustomerExperienceComponent,
    },                                                                     
]   

export const customerExperienceRouting: ModuleWithProviders = RouterModule.forChild(customerExperienceRoutes);