import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  
  /* reportes graficados */
  private ulrGetUltimosRegistrosPersonas = environment.api + 'dashboard/ultimos_registros_personas';
  private urlGetInfoEstadisticas = environment.api + 'dashboard/info_estadisticas';
  private urlparquesrainfores = environment.api + 'crm_reportes/parquesrainfores';
  private urlobtenerparqueid= environment.api+'crm_reportes/datosparque/';
  
  constructor(public http: HttpClient) { }
  

  
 
  public getUltimosRegistrosPer(){
    return this.http.get(this.ulrGetUltimosRegistrosPersonas);
  }
  
  public getUrlInfoestadistica(){
    return this.http.get(this.urlGetInfoEstadisticas);
  }

  public obtenerparqueid(id)
  {
    return this.http.get(this.urlobtenerparqueid + id);
  }
  
  public parquesrainfores()
  {
    return this.http.get(this.urlparquesrainfores);
  }

}