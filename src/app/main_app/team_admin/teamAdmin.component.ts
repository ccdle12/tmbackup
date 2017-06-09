import { Component }  from '@angular/core';
import { UserProfilesService } from '../../shared/services/userProfiles.service';

@Component({
  moduleId: module.id,
  selector: 'teamAdmin',
  templateUrl: 'teamAdmin.component.html',
  styleUrls: ['./teamAdmin.component.css'],
  providers: [UserProfilesService]
})

export class TeamAdminComponent  { 
  userProfiles:  UserProfile[];

  constructor(private userProfilesServices: UserProfilesService) {
    this.userProfilesServices.getUserProfiles().subscribe(userProfiles => {
          this.userProfiles = userProfiles
    });
  }
}

interface UserProfile {
  userRole:  string;
  userPic:   string;
  userName:  string;
  userTitle: string;
  email:     string;
 }
