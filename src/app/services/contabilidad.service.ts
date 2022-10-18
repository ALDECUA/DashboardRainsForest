import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContabilidadService {
  public urlSubirPago = environment.dominio + 'api/storage/uploadDocumento.php';
  public urlComisiones = environment.api + 'contabilidad/personas_comisiones';
  public urlComisionesP = environment.api + 'contabilidad/persona_comisiones';
  public urlGuardarMovimiento = environment.api + 'contabilidad/movimientos_cc';
  public urlGetMovimientos = environment.api + 'contabilidad/movimientos';
  public urlSubirComp = environment.dominio + 'api/storage/comp_cajachica.php';
  public urlReporteMovimientos = environment.api + 'contabilidad/reporte_movimientos';
  public urlInsertarExcel = environment.api + 'contabilidad/excel';
  public urlExcelPagos = environment.api + 'contabilidad/excelPagos';

  public urlVolumen = environment.api + 'contabilidad/Volumen'
  public urlObtenerTeamLider = environment.api + 'contabilidad/ObtenerTeamLider'
  public urlEliminarMovimiento = environment.api + 'contabilidad/eliminarmov/'
  public urlGetLotes = environment.api +'contabilidad/lotes/'

  constructor(private http: HttpClient) {}
  public SubirComp(data) {
    return this.http.post(this.urlSubirPago, data);
  }
  public SubirCompC(data) {
    return this.http.post(this.urlSubirComp, data);
  }
  public getComisiones(data) {
    return this.http.post(this.urlComisiones, data);
  }
  public Comisiones(data) {
    return this.http.post(this.urlComisionesP, data);
  }
  public GuardarMovimiento(data) {
    return this.http.post(this.urlGuardarMovimiento, data);
  }
  public GetMovimientos(data) {
    return this.http.post(this.urlGetMovimientos, data);
  }
  public ReportePDF(data) {
    return this.http.post(this.urlReporteMovimientos, data, {
      responseType: 'blob',
    });
  }
  public InsertarExcel(data){
    return this.http.post(this.urlInsertarExcel,data)
  }
  
  public Volumen(data) {
    return this.http.post(this.urlVolumen, data);
  }
  public ObtenerTeamLider(data) {
    return this.http.post(this.urlObtenerTeamLider, data);
  }
  public EliminarMoviemto(id){
    return this.http.get(this.urlEliminarMovimiento+id)
  }
  public lotes(id){
    return this.http.get(this.urlGetLotes+id)
  }
  public InsertarExcelPagos(data){
    return this.http.post(this.urlExcelPagos,data)
  }
}
