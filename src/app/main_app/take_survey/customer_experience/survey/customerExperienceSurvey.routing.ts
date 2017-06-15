import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerExperienceSurveyComponent } from './customerExperienceSurvey.component';

const customerExperienceSurveyRoutes: Routes = [
    {
        path: '',
        component: CustomerExperienceSurveyComponent,
    },                                                               
]   

export const customerExperienceSurveyRouting: ModuleWithProviders = RouterModule.forChild(customerExperienceSurveyRoutes); 