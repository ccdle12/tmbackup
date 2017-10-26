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

}