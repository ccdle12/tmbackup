import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerEngagementComponent } from './customerEngagement.component';
import { CustomerEngagementCaseStudies } from './case_studies/caseStudies.component';

const customerEngagementRoutes: Routes = [
    {
        path: '',
        component: CustomerEngagementComponent,
        children: [
            {
            path: 'survey',
            loadChildren: './survey/customerEngagementSurvey.module#CustomerEngagementSurveyModule',
        },
        {
            path: 'casestudies',
            component: CustomerEngagementCaseStudies,
        }
        ]
    },                                                                   
]   

export const customerEngagementRouting: ModuleWithProviders = RouterModule.forChild(customerEngagementRoutes); 