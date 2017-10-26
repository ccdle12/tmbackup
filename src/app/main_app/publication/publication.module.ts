import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { publicationRouting } from './publication.routing';

import { PublicationComponent } from './publication.component';
import { MatButtonModule} from '@angular/material';
import { KumulosService } from '../../shared/services/kumulos.service';


@NgModule({
  imports: [publicationRouting, CommonModule, MatButtonModule],
  declarations: [PublicationComponent],
  providers: [KumulosService],
  
})
export class PublicationModule { }