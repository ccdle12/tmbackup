import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerExperienceComponent } from './customerExperience.component';
// import { CustomerExperienceSurveyComponent } from './survey/customerExperienceSurvey.component';

const customerExperienceRoutes: Routes = [
    {
        path: '',
        component: CustomerExperienceComponent,
        children: [
            {
            path: 'survey',
            loadChildren: './survey/customerExperienceSurvey.module#CustomerExperienceSurveyModule',
            }
        ]
    },                                                                   
]   

export const customerExperienceRouting: ModuleWithProviders = RouterModule.forChild(customerExperienceRoutes); 