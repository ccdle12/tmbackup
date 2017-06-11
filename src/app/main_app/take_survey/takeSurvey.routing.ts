import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { TakeSurveyComponent } from './takeSurvey.component';
import { CustomerEngagementComponent } from './customerEngagement/customerEngagement.component';

const mainAppRoutes: Routes = [
    {
        path: '',
        component: TakeSurveyComponent,
    }, 
    {
        path: 'customerengagement',
        component: CustomerEngagementComponent,
    }                                                                           
]   

export const takeSurveyRouting: ModuleWithProviders = RouterModule.forChild(mainAppRoutes); 