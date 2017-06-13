import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { TakeSurveyComponent } from './takeSurvey.component';

const takeSurveyRoutes: Routes = [
    {
        path: '',
        component: TakeSurveyComponent,
        children: [
            {
                path: 'customerengagement',
                loadChildren: './customer_engagement/customerEngagement.module#CustomerEngagementModule'
            },
            {
                path: 'customerexperience',
                loadChildren: './customer_experience/customerExperience.module#CustomerExperienceModule'
            }
        ]
    },                                                                        
]   

export const takeSurveyRouting: ModuleWithProviders = RouterModule.forChild(takeSurveyRoutes); 