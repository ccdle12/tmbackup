import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'loadingSnackBar',
  templateUrl: 'loadingSnackBarComponent.html',
  styleUrls: ['loadingSnackBarComponent.css'],
  providers: [MdSnackBar]
})
export class LoadingSnackBar 
{
  constructor(public snackbar: MdSnackBar){}

  public showLoadingSnackBar()
  {
    this.snackbar.open("Loading...");
  }

  public dismissLoadingSnackBar()
  {
    this.snackbar.dismiss();
  }

}