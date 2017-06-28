import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { SurveyModuleComponent } from './surveyModule.component';
import { CaseStudiesComponent } from './case_studies/caseStudies.component';
import { BestPracticeComponent } from './best_practice/bestPractice.component';
import { EvidenceComponent } from './evidence/evidence.component';

const surveyModuleRoutes: Routes = [
    {
        path: '',
        component: SurveyModuleComponent,
        children: [
            {
            path: 'survey',
            loadChildren: './survey/survey.module#SurveyModule',
        },
        {
            path: 'casestudies',
            component: CaseStudiesComponent,
        },
        {
            path: 'bestpractice',
            component: BestPracticeComponent,
        },
        {
            path: 'evidence',
            component: EvidenceComponent,
        }
        ]
    },                                                                   
]   

export const surveyModuleRouting: ModuleWithProviders = RouterModule.forChild(surveyModuleRoutes); 