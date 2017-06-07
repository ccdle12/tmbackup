import { Routes, RouterModule }    from '@angular/router';
import { ModuleWithProviders }     from '@angular/core'

import { ViewResultsComponent }    from './viewResults.component';

const mainAppRoutes: Routes = [
    {
        path: '',
        component: ViewResultsComponent
    }                                                                           
]   

export const viewResultsRouting: ModuleWithProviders = RouterModule.forChild(mainAppRoutes); 