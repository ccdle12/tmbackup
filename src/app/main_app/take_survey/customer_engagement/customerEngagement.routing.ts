import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerEngagementComponent } from './customerEngagement.component';
import { CustomerEngagementSurveyComponent } from './survey/customerEngagementSurvey.component';

const customerEngagementRoutes: Routes = [
    {
        path: '',
        component: CustomerEngagementComponent,
        children: [
            {
            path: 'survey',
            loadChildren: './survey/customerEngagementSurvey.module#CustomerEngagementSurveyModule',
            },
        ]
    },                                                                   
]   

export const customerEngagementRouting: ModuleWithProviders = RouterModule.forChild(customerEngagementRoutes); 