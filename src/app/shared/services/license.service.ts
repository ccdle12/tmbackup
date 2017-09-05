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

    public getLicenseType()
    {
        let userMetaData = this.getUserMetaData();

        if (userMetaData){
            console.log("From licnesE: " + JSON.stringify(userMetaData['license']['licenseType']));
           return JSON.stringify(userMetaData['license']['licenseType']);
        }
        else
            return null;
    }

    public isLicenseValid()
    {
         let licenseType: String = this.getLicenseType();
         licenseType = licenseType.split('"').join("");

         if (licenseType === "DEMO")
            console.log("license type does EQUAL: " + licenseType);
         
         if (licenseType)
            if (licenseType === "DEMO" || licenseType === "WORKSHOP")
                return false;
            else
                return true;
         else
            return false;
    }
}