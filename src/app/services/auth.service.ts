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
  private urlUptPortada = environment.api + 'users/updateportada';
  private urlFotoP = environment.dominio+"api/storage/uploadFotoInversionista.php";
  private urlEnviarError = environment.dominio+'asesores/app/correoAyudaInversionista';
  private urlRegistrarPersona = environment.api + 'reclutamiento/insertar_simple';
  private urlRegistroInversionista = environment.api + 'hr/crear_inversionista_simple'
  private urlPwdInversionista = environment.api +'users/pwd_imversionistas'
  private urlDashboard = environment.api + 'login/dashboard/';
  private urlSubirFoto = 'https://greenpark.mx/api/storage/insertarImagenPerfil.php';
  private urlUptFoto = environment.api + 'users/updatefotostatuswapp';
  private urlSubirPortada = 'https://greenpark.mx/api/storage/insertarImagenPortada.php';
 

  public logged = false;
  public user: any = {};
  public permisos: any = {};
  public menus: any = [];

  constructor(public http: HttpClient) {
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('user_data');

    if (userData) {
      this.user = JSON.parse(userData);
      this.refreshUserData();
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
    public ReporteErrores(data) {
      return this.http.post(this.urlEnviarError, data);
    }
    public InsertarPersona(data) {
      return this.http.post(this.urlRegistrarPersona, data);
    }
    public CrearInversionista(data) {
      return this.http.post(this.urlRegistroInversionista, data);
    }
    public PwdInversionista(data)
    {
      return this.http.post(this.urlPwdInversionista,data);
    }
    public subirPortadaServidor(data) {
      return this.http.post(this.urlSubirPortada, data);
    }
  
    public updatePortada(data) {
      return this.http.post(this.urlUptPortada, data);
    }
    public actualizar(data){
      return this.http.post(this.urlUptFoto,data);
    }
    public refreshUserData() {
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
        if (menu.Lectura === 1) {
          this.menus.push(menu.IdMenu);
        }
      });
      this.menus.push(0);
      console.log(this.menus)
    }
  }
  