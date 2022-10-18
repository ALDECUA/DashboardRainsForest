import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class LoadloginpageGuard implements CanLoad {

  constructor(public app: AppService) { }
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('app login');
    this.app.renderApp = false;
    const token = localStorage.getItem('auth_token');
    if (token) {
      if (token.length > 10) {
        location.href = '/crm';
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

  }
}
