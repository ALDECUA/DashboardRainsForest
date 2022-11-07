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
  private urlGetLotes = environment.api + 'crm_reportes/lotes';
  private urlGetCalculoVendido = environment.api + 'crm_reportes/calculoOver';
  private urlGetHrsTANA = environment.api + 'crm_reportes/hrsTANA';
  private urlGetReporteECE = environment.api + 'crm_reportes/reporteECE';
  private urlGetReporteSexo = environment.api + 'crm_reportes/reporteSexo';
  private urlGetReporteSimple = environment.api + 'crm_reportes/reporteInvSimple';
  private urlGetReferidoInv = environment.api + 'crm_reportes/referidosInversionista/';
  private urlGetInfoVentaLoteXDes = environment.api + 'crm_reportes/reporteHR';
  private urlGetLLamadas = environment.api + 'hr/obtener_llamadas';
  private urlGetInversionistas = environment.api + 'crm_reportes/reporteInv';
  private urlGetSociosComerciales = environment.api + 'reclutamiento/socios_comerciales';


  /* reportes impresos */
  private urlReporteHR = environment.api + 'crm_reportes/reporteHR';
  private urlLotesDispo = environment.api + 'crm_reportes/lotes';
  private urlVolumenHR = environment.api + 'crm_reportes/volumenHR';
  private urlGetDesarrollos = environment.api + 'desarrollos/1';
  private urlImprimirReporte = environment.api + 'crm_reportes/imprimir_reporte';
  private urlPrintReporte = environment.api + 'crm_reportes/reporteEstadisticas';
  private urlGetReporteHRFiltro = environment.api + 'crm_reportes/reporteHRfiltro';
  private urlgetDesarrolloslotes = environment.api + 'desarrollos/obtenerdesarrolloslotes';
  private urlFiltrarLotes = environment.api + 'desarrollos/FiltrarLotes';
  private urlCotizaciones = environment.api + 'crm_reportes/ReportesCotizaciones';
  private ulrReporteCotizaciones = environment.api + 'crm_reportes/ReportesCotizaciones/CRM';
  private urlparquesrainfores = environment.api + 'crm_reportes/parquesrainfores';
  private urlobtenerparqueid = environment.api + 'crm_reportes/obtenerparqueid/';
  
  constructor(public http: HttpClient) { }
  

  
  public ReporteCotizaciones(){
    return this.http.get(this.ulrReporteCotizaciones);
  }
  public getUltimosRegistrosPer(){
    return this.http.get(this.ulrGetUltimosRegistrosPersonas);
  }
  
  public getUrlInfoestadistica(){
    return this.http.get(this.urlGetInfoEstadisticas);
  }

  public getUrlTotalLotes(){
    return this.http.get(this.urlGetLotes);
  }

  public getUrlVendidosSc(data){
    return this.http.post(this.urlGetCalculoVendido,data);
  }
  public FiltrarLotes(data){
    return this.http.post(this.urlFiltrarLotes,data);
  }

  public getReporteECE(){
    return this.http.get(this.urlGetReporteECE);
  }

  public getHrsTANA(){
    return this.http.get(this.urlGetHrsTANA);
  }

  public getReporteSexo(){
    return this.http.get(this.urlGetReporteSexo);
  }
  public getLlamadas() {
    return this.http.get(this.urlGetLLamadas);
  }

  public ReporteInv(data){
    return this.http.post(this.urlGetInversionistas,data);
  }
  public ObtenerSociosComerciales(){
    return this.http.get(this.urlGetSociosComerciales);
  }

   /* reportes impresos */

  public getReporteSimple(data){
    return this.http.post(this.urlGetReporteSimple,data);
  }

  public getReporteInv(id){
    return this.http.get(this.urlGetReferidoInv ,  id);
  }
  public Cotizaciones()
  {
    return this.http.get(this.urlCotizaciones);
  }
  public obtenerparqueid(id)
  {
    return this.http.get(this.urlobtenerparqueid , id);
  }
  
  public parquesrainfores()
  {
    return this.http.get(this.urlparquesrainfores);
  }
  
  public ReporteHR()
  {
    return this.http.get(this.urlReporteHR);
  }
  public lotes()
  {
    return this.http.get(this.urlLotesDispo);
  }
  public VolumenHR(data)
  {
    return this.http.post(this.urlVolumenHR,data);
  }
  public getDesarrollos()
  {
    return this.http.get(this.urlGetDesarrollos);
  }
  public getDesarrolloslotes()
  {
    return this.http.get(this.urlgetDesarrolloslotes);
  }
  public enviarReporte(data)
  {
    return this.http.post(this.urlImprimirReporte,data,{responseType:'blob'});
  }
  public sendReport(data){
    return this.http.post(this.urlPrintReporte,data,{responseType:'blob'});
  }
  public InfoLoteXDes(){
    return this.http.get(this.urlGetInfoVentaLoteXDes);
  }
  public RHconFiltro(data){
    return this.http.post(this.urlGetReporteHRFiltro, data);
  }
}