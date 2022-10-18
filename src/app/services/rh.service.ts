import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RhService {
  private urlGetRec = environment.api + 'reclutamiento/personas';
  private urlGetDashboard1 = environment.api + 'dashboard/info_estadisticas';
  private urlGetDashboard2 =
    environment.api + 'dashboard/ultimos_registros_personas';
  private urlGetPer = environment.api + 'reclutamiento/obtener_persona_crm/';
  private urlGetCm = environment.api + 'reclutamiento/cumples';
  private urlGetUD =
    environment.api + 'reclutamiento/actualizar_status_documentos';
  private urlGetCmF = environment.api + 'reclutamiento/obtenerCumplesFiltrados';
  private urlUptUsuario =
    environment.api + 'reclutamiento/actualizar_datos_persona';
  private urlUptBank =
    environment.api + 'reclutamiento/actualizar_datos_bancarios';
  private urlEliminar = environment.api + 'hr/eliminarHR';
  private urlgetReporteGeneral =
    environment.api + 'reclutamiento/reporte_global';
  private urlGetLotes = environment.api + 'crm_reportes/lotes';
  private urlGetObtenerReclutas =
    environment.api + 'dashboard/reporte_reclutas';
  private urlReporteSC = environment.api + 'dashboard/reporte_sc/';

  constructor(private http: HttpClient) {}

  public getPersonasReclutamiento() {
    return this.http.get(this.urlGetRec);
  }

  public getObtenerPersona(id) {
    return this.http.get(this.urlGetPer + id);
  }

  public dashboardTotalPersonas() {
    return fetch(this.urlGetDashboard1);
  }

  public dashboardUltimasPersonas() {
    return fetch(this.urlGetDashboard2);
  }

  public obtenerSociosComerciales() {
    return fetch(environment.api + 'reclutamiento/socios_comerciales').then(
      (response) => response.json()
    );
  }

  public obtenerILideres(id) {
    return fetch(
      environment.api + 'reclutamiento/inversionistas_lider/' + id
    ).then((response) => response.json());
  }

  public obtenerISenior(id) {
    return fetch(
      environment.api + 'reclutamiento/inversionistas_senior/' + id
    ).then((response) => response.json());
  }

  public obtenerCumpleanios() {
    return this.http.get(this.urlGetCm);
  }

  public actualizarStatusArchivos(data) {
    return this.http.post(this.urlGetUD, data);
  }
  public obtenerCumpleaniosFiltrados(data) {
    return this.http.post(this.urlGetCmF, data);
  }

  public updatePersonaGeneral(data) {
    return this.http.post(this.urlUptUsuario, data);
  }

  public updateBancoGeneral(data) {
    return this.http.post(this.urlUptBank, data);
  }
  public eliminarHr(dato) {
    return this.http.post(this.urlEliminar, dato);
  }
  public ReporteGeneral(data) {
    return this.http.post(this.urlgetReporteGeneral, data, {
      responseType: 'blob',
    });
  }
  public getUrlTotalLotes() {
    return this.http.get(this.urlGetLotes);
  }
  public GetObtenerReclutas() {
    return this.http.get(this.urlGetObtenerReclutas);
  }
  public ReporteSC(id){
    return this.http.get(this.urlReporteSC+id);
  }
}
