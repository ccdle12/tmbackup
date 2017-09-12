import { Component, Inject } from '@angular/core';
import { KumulosService } from '../../shared/services/kumulos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation.service';
import { MdInputContainer, MdDialog, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { NgModule } from '@angular/core';
import { LicenseService } from '../../shared/services/license.service';
import { LocalStorageService } from '../../shared/services/localStorage.service';
import { Router } from '@angular/router';
import { LoadingSnackBar } from '../../shared/components/loadingSnackBar';

@Component({
  selector: 'bulkInvite',
  templateUrl: './bulkInvite.component.html',
  styleUrls: ['./bulkInvite.component.css']
})
export class BulkInviteComponent 
{
    bulkEmails: String;
    splitBulkEmails: Array<any>;
    regexEmailFailedCache: Array<any>;
    userProfiles: Array<any>;

    invalidEmailsFlag: boolean;

    constructor(public formBuilder: FormBuilder, public kumulosService: KumulosService, public licenseService: LicenseService,
                public localStorageService: LocalStorageService, public snackbar: MdSnackBar, public dialog: MdDialog,
                public router: Router,  public loadingSnackBar: LoadingSnackBar) 
    {
        this.initMemberVariables();
        this.getAllUsers();
    }

    private initMemberVariables()
    {
        this.splitBulkEmails = new Array();
        this.userProfiles = new Array();
        this.regexEmailFailedCache = new Array();
        this.invalidEmailsFlag = true;
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
        this.splitBulkEmails = this.bulkEmails.split(",");

        if ((this.userProfiles.length + this.splitBulkEmails.length) < this.licenseService.getMaxUsers())
        {
            this.checkEmailsValid();

            if (this.invalidEmailsFlag)
            {
                this.sendEmailsToKumulos();
                this.clearBulkEmails();
            }
            else
            {                
                this.launchInvalidEmailsDialog();
            }
        }
        else
        {
             this.snackbar.open("Maximum Users Reached", "Dismiss");
        }
    }

    private sendEmailsToKumulos()
    {
        this.loadingSnackBar.showLoadingSnackBar();

        let formattedEmails: string = this.formatBulkEmails();
        let userCity: string = this.localStorageService.getUserCity();
        let userCityID: string = this.localStorageService.getUserCityId();

        this.kumulosService.webBulkInviteUser(formattedEmails, userCity, userCityID).subscribe(response => {
            this.loadingSnackBar.dismissLoadingSnackBar();
            this.launchBulkInviteSuccessDialog();
        });
    }

    private clearBulkEmails(): void
    {
        this.splitBulkEmails = [];
    }

    private launchInvalidEmailsDialog()
    {
        let dialogRef = this.dialog.open(EmailInvalidDialog, {
            height: '400px',
            width: '800px',         
            data: { failedEmails : this.regexEmailFailedCache},
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(response => { 
            this.regexEmailFailedCache = [];
            this.invalidEmailsFlag = true;
        });
    }

    private launchBulkInviteSuccessDialog()
    {
        let dialogRef = this.dialog.open(SuccessBulkInviteDialog, {
            height: '400px',
            width: '800px',
            disableClose: true,    
        });

        dialogRef.afterClosed().subscribe(response => { 
             this.router.navigateByUrl('/main/teamadmin');
        });
    }

    private formatBulkEmails(): string
    {
        let formattedEmailsArray = new Array();

        for (let i = 0; i < this.splitBulkEmails.length; i++)
        {
            if (this.splitBulkEmails[i].length > 0)
            {
                let emailKV = "{" + '"email"' + ":" + " " + '"' + this.splitBulkEmails[i] + '"' + "}";
                formattedEmailsArray.push(emailKV);
            }
        }

        let result: string = '{"emailAddresses":' + "[" + formattedEmailsArray.toString() + ']' + '}'; 

        return result; 
    }

    private checkEmailsValid(): void
    {
        for (let i = 0; i < this.splitBulkEmails.length; i++)
        {
            this.splitBulkEmails[i] = this.splitBulkEmails[i].trim();

            if (this.splitBulkEmails[i] == "")
                continue;
            
            console.log("Split Emails: " + this.splitBulkEmails[i]);

            if (!this.splitBulkEmails[i].match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/))
            {   
                console.log("Regex failed"); 
                this.regexEmailFailedCache.push(this.splitBulkEmails[i]);
                this.invalidEmailsFlag = false;
            }
        }
    }
}

@Component({
    selector: 'emailInvalidDialog',
    templateUrl: 'emailInvalidDialog.html',
    styleUrls: ['emailInvalidDialog.css'],
})
export class EmailInvalidDialog
{
    constructor(@Inject(MD_DIALOG_DATA) public data: any) 
    {
        console.log(data.failedEmails);
    };
}

@Component({
    selector: 'successBulkInivteDialog',
    templateUrl: 'successBulkInviteDialog.html',
    styleUrls: ['successBulkInviteDialog.css'],
})
export class SuccessBulkInviteDialog
{
    constructor()
    {
        
    }
}