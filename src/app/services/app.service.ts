import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public dominio = environment.dominio;
  public sidebarState = true;

  public currentModule: string = 'Index';
  public currentSection: string = '';

  public renderApp: boolean = false;

  private urlPaises = environment.api + 'webapp/paises';
  private urlRegistroInversionista = environment.api + 'hr/crear_inversionistaHR'
  private urlRegistrarPersona = environment.api + 'reclutamiento/insertar_simple';
  private urlGetAsesrores = environment.api + 'hr/personasInv';

  constructor(private http: HttpClient) {
    
  }

  public toggleSidebar(state:number) {
    if(state === 1){
      this.sidebarState = true;
    } else {
      this.sidebarState = false;
    }
  }

  public getPaises() {
    return this.http.get(this.urlPaises);
  }
  public getAsesores() {
    return this.http.get(this.urlGetAsesrores);
  }
  public InsertarPersona(data) {
    return this.http.post(this.urlRegistrarPersona, data);
  }
  public CrearInversionista(data) {
    return this.http.post(this.urlRegistroInversionista, data);
  }
}
