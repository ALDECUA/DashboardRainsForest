import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HasGrantGuard implements CanActivate {

  constructor(private auth: AuthService, private toast: ToastrService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {

    let grant = route.data.grant;

    if (this.auth.menus.length === 0) {
      return this.getMenus(grant);
    } else {
      if (this.auth.menus.includes(grant)) {
        return true;
      } else {
        this.toast.error('No tienes permiso para realizar esta acción', 'Acceso denegado');
        this.router.navigateByUrl('/crm');
        return false;
      }
    }


  }

  public async getMenus(grant): Promise<boolean> {
    /* await this.auth.refreshUserData(); */
    console.log('enmenu');
    return new Promise((resolve, reject) => {
/*       if (this.auth.menus.includes(grant)) { */
        resolve(true);
     /*  } else {
        this.toast.error('No tienes permiso para realizar esta acción', 'Acceso denegado');
        this.router.navigateByUrl('/crm');
        resolve(false);
      } */
    });
  }

}
