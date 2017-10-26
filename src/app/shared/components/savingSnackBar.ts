import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class SavingSnackBar 
{
  constructor(public snackbar: MatSnackBar){}

  public showSavingSnackBar()
  {
    this.snackbar.open("Saving...");
  }

  public showSavedSnackBar()
  {
    this.snackbar.open("Saved", '', {
      duration: 3000
    });
  }
  public dismissSavingSnackBar()
  {
    this.snackbar.dismiss();
  }

}