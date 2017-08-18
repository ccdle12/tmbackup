import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
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