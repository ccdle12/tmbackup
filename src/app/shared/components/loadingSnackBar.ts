import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingSnackBar 
{
  constructor(public snackbar: MatSnackBar){}

  public showLoadingSnackBar()
  {
    this.snackbar.open("Loading...");
  }

  public dismissLoadingSnackBar()
  {
    this.snackbar.dismiss();
  }

  public showLoadingSnackBarWithMessage(message)
  {
    this.snackbar.open(message)
  }

  public showLoadingSnackBarWithMessageAndTimer(message)
  {
    this.snackbar.open(message, '', {
      duration: 3000
    });
  }

  public customSnackBar(message) {
    return this.snackbar.open(message, 'OK');
  }
}