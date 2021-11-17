import {Injectable, ViewChild} from '@angular/core';

@Injectable()
export class Colors {


  public static tileColor = '#000000';
  public static background = '#d4d4d4';
  public static primary = window.getComputedStyle(document.body).getPropertyValue('--primary-background');
  public static accent = window.getComputedStyle(document.body).getPropertyValue('--secondary-background');
  public static wallColor = window.getComputedStyle(document.body).getPropertyValue('--primary-background-active');
  public static searchColor = window.getComputedStyle(document.body).getPropertyValue('--secondary-background');
  public static searchColorDark = window.getComputedStyle(document.body).getPropertyValue('--secondary-background-active');
  public static startColor = '#32cd32';
  public static endColor = 'orangered';
}
