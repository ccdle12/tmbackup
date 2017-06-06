import { Routes, RouterModule }    from '@angular/router';
import { ModuleWithProviders }     from '@angular/core'

import { TakeSurveyComponent }     from './takeSurvey.component';

const mainAppRoutes: Routes = [
    {
        path: '',
        component: TakeSurveyComponent,

    }                                                                           
]   

export const takeSurveyRouting: ModuleWithProviders = RouterModule.forChild(mainAppRoutes); 