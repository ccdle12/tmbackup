import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDynamicsComponent } from './teamDynamics.component';
import { KumulosService } from '../../../shared/services/kumulos.service';

import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatDialogModule, MatMenuModule, MatIconModule, MatInputModule, MatButtonModule, MatTabsModule} from '@angular/material';

@NgModule({
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule, MatTabsModule],
  declarations: [],
  providers: [KumulosService],
})
export class TeamDynamicsModule { }