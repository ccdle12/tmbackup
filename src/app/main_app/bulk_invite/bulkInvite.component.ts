import { Component } from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';
import { MdInputContainer } from '@angular/material';
import { NgModule } from '@angular/core';
import { LicenseService } from '../../shared/services/license.service';
import { LocalStorageService } from '../../shared/services/localStorage.service';

@Component({
  selector: 'bulkInvite',
  templateUrl: './bulkInvite.component.html',
  styleUrls: ['./bulkInvite.component.css']
})
export class BulkInviteComponent 
{
    bulkEmails: String;
    splitBulkEmails: Array<any>;
    userProfiles: Array<any>;

    constructor(public formBuilder: FormBuilder, public kumulosService: KumulosService, public licenseService: LicenseService,
                public localStorageService: LocalStorageService) 
    {
        this.initMemberVariables();
        this.getAllUsers();
    }

    private initMemberVariables()
    {
        this.splitBulkEmails = new Array();
        this.userProfiles = new Array();
    }




    //API call for size of users
    private getAllUsers(): void 
    {
        this.kumulosService.getWebUsers().subscribe(response => this.userProfiles = response.payload);
    }


    

    //Method call from View
    public bulkEmailsEntered(): boolean
    {
        return (this.bulkEmails == null || this.bulkEmails.length == 0);
    }

    public sendBulkEmails()
    {
        console.log("Bulk email: " + this.bulkEmails);
        this.splitEmailsIntoArray();
    }

    private splitEmailsIntoArray(): void
    {
        this.splitBulkEmails = this.bulkEmails.split(",");

        if ((this.userProfiles.length + this.splitBulkEmails.length) < this.licenseService.getMaxUsers())
        {
            let formattedEmails: string = this.formatBulkEmails();
            let userCity: string = this.localStorageService.getUserCity();
            let userCityID: string = this.localStorageService.getUserCityId();

            console.log(userCity);
            console.log(userCityID);

            this.sendEmailsToKumulos(formattedEmails, userCity, userCityID);
        }
        else
            console.log("User has reach limit");
    }

    private formatBulkEmails(): string
    {
        let formattedEmailsArray = new Array();

        for (let i = 0; i < this.splitBulkEmails.length; i++)
        {
            if (this.splitBulkEmails[i].length > 0)
            {
                this.splitBulkEmails[i] = this.splitBulkEmails[i].trim();
                let emailKV = "{" + '"email"' + ":" + " " + '"' + this.splitBulkEmails[i] + '"' + "}";
                formattedEmailsArray.push(emailKV);
            }
        }

        let result: string = '{"emailAddresses":' + "[" + formattedEmailsArray.toString() + ']' + '}'; 
        console.log(result);
        return result; 
    }
    
    private sendEmailsToKumulos(formattedEmails: string, userCity: string, userCityID: string)
    {
        this.kumulosService.webBulkInviteUser(formattedEmails, userCity, userCityID).subscribe(response => console.log(response.payload));
    }
}
