import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlLogin = environment.api + 'login/login_crm';
  private urlFoto = environment.dominio+"api/storage/uploadFotoCrm.php";
  private urlGetData = environment.api + 'login/crm_me';
  private urlPwd = environment.api + 'users/password';

  public logged = false;
  public user: any = {};
  public permisos: any = {};
  public menus: any = [];

  constructor(public http: HttpClient) {
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('user_data');

    if (userData) {
      this.user = JSON.parse(userData);
      /* this.refreshUserData(); */
    } else {
      //this.logout();
      //location.href = '/login';
    }
  }

  public login(data) {
    return this.http.post(this.urlLogin, data);
  }
  public CambiarPwd(data) {
    return this.http.post(this.urlPwd, data);
  }

  public logout() {
    localStorage.clear();
  }

  public cambiarFoto(data) {
    return this.http.post(this.urlFoto, data);
  }

 /*  public refreshUserData() {
    return new Promise((resolve, reject) => {
      this.http.post(this.urlGetData, {}).subscribe((res: any) => {
        if (res.unauthorized) {
          alert('Tu sesión ha caducado!');
          this.logout();
          window.location.href = '/angularcrm/login';
          resolve(true)
        } else {
          this.permisos = JSON.parse(res.permisos);
          localStorage.setItem('user_data', JSON.stringify(res));
          this.user = res;
          this.generateMenus();
          resolve(true);
        }
      });
    })
  }

  public generateMenus() {
    this.permisos.Menus.forEach((menu) => {
      if (menu.Menus.Lectura === 1) {
        this.menus.push(menu.Menus.IdMenu);
      }
    });
    this.menus.push(0);
  } */
}