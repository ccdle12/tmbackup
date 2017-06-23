import { Component }  from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';

@Component({
  // moduleId: module.id,
  selector: 'teamAdmin',
  templateUrl: 'teamAdmin.component.html',
  styleUrls: ['./teamAdmin.component.css']
})

export class TeamAdminComponent  { 
  userProfiles:  JSON[];

  constructor(private kumulosService: KumulosService) {
    this.kumulosService.getWebUsers().subscribe(response => {
          console.log("response", response.payload);
          this.userProfiles = response.payload
          console.log(this.userProfiles);
    });
  } 
}
