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

  public getUsersName(index: number): string {

    let userName: string;

    if (this.hasUserMetaData(index))
      userName = this.userProfiles[index]['user_metadata']['name'];
    else 
      userName = this.userProfiles[index]['name'];
    

    return userName;
  }

  public getUsersTitle(index: number): string {

    let userTitle: string;

    if (this.hasUserMetaData(index))
      userTitle = this.userProfiles[index]['user_metadata']['jobTitle'];
    else 
      userTitle = this.userProfiles[index]['headline'];
    

    return userTitle;
  }  

  private hasUserMetaData(index: number): boolean {
    return this.userProfiles[index]['user_metadata'] ? true : false;
  }


}
