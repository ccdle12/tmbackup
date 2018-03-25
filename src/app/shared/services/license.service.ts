import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LicenseService 
{ 

    public getUserMetaData() 
    {
        let userProfile = JSON.parse(localStorage.getItem('userProfile'));

        if (userProfile)
            return userProfile['user_metadata'];
        else
            return null;
    }

    public isLicenseValid()
    {
         let licenseType: String = this.getLicenseType();
         licenseType = licenseType.split('"').join("");

        return !(licenseType === "DEMO" || licenseType === "WORKSHOP");
    }

     public getLicenseType()
    {
        let userMetaData = this.getUserMetaData();

        if (userMetaData){
           ("From licnesE: " + JSON.stringify(userMetaData['license']['licenseType']));
           return JSON.stringify(userMetaData['license']['licenseType']);
        }
        else
            return null;
    }

    public getMaxUsers()
    {
        let userMetaData = this.getUserMetaData();

        let maxUsers = JSON.stringify(userMetaData['license']['maxUsers']);
        maxUsers = maxUsers.split('"').join("");
        let maxUsersNum: number = Number(maxUsers);

        if (userMetaData)
            return userMetaData['license']['maxUsers'];
        else
            return null;
    }

}