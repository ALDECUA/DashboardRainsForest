import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class LoadapppageGuard implements CanLoad {
  constructor(public app: AppService, public router: Router) { }
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('app app ' + this.router.url);
    if (!this.router.url.includes('login')) {
      this.app.renderApp = true;
    }
    return true;
  }
}
