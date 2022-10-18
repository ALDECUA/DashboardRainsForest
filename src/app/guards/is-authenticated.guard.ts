import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanLoad {

  constructor(private router: Router, private app: AppService) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let token = localStorage.getItem('auth_token');

    if (token) {
      if (token.length > 30) {
        this.app.renderApp = true;
        return true;
      }
    }
    
    this.router.navigateByUrl('/login');
    return false;

  }
}
