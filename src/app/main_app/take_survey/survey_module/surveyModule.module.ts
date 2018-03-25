import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { surveyModuleRouting } from './surveyModule.routing';
import { SurveyModuleComponent } from './surveyModule.component';
import { CaseStudiesComponent } from './case_studies/caseStudies.component';
import { BestPracticeComponent } from './best_practice/bestPractice.component';
import { EvidenceComponent } from './evidence/evidence.component';
import { MatSliderModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule, MatCardModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

// import { SaveSurveyGuardService } from '../../../shared/services/saveSurvey-guard.service';


@NgModule({
  imports: [CommonModule, surveyModuleRouting, FormsModule, MatTooltipModule, MatSidenavModule, MatButtonToggleModule, MatTabsModule, MatButtonModule, MatIconModule,  MatSliderModule, MatCardModule],
  declarations: [SurveyModuleComponent, CaseStudiesComponent, BestPracticeComponent, EvidenceComponent],
  providers: [],
  
})
export class SurveyModule { }