import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { CustomerEngagementSurveyComponent } from './customerEngagementSurvey.component';

const customerEngagementSurveyRoutes: Routes = [
    {
        path: '',
        component: CustomerEngagementSurveyComponent,
    },                                                               
]   

export const customerEngagementSurveyRouting: ModuleWithProviders = RouterModule.forChild(customerEngagementSurveyRoutes); 