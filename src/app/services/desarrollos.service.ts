import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesarrollosService {

  private urlGetEmpresas = environment.api + 'empresas';
  private urlGetEmpresa = environment.api + 'empresas';
  private urlEditEmpresa = environment.api + 'empresas/editar';
  private urlCrearEmpresa = environment.api + 'empresas/crear';

  private urlGetDesarrollos = environment.api + 'desarrollos';
  private urlGetDesarrollo = environment.api + 'desarrollos';
  private urlEditDesarrollo = environment.api + 'desarrollos/editar';
  private urlCrearDesarrollo = environment.api + 'desarrollos/crear';

  private urlGetEtapas = environment.api + 'fases';
  private urlGetEtapa = environment.api + 'fase';
  private urlEditEtapa = environment.api + 'fase/editar';
  private urlCrearEtapa = environment.api + 'fases/crear';

  private urlGetLotes = environment.api + 'lotes';
  private urlGetLote = environment.api + 'lote';
  private urlEditLote = environment.api + 'lotes/editar';
  private urlCrearLote = environment.api + 'lotes/crear';
  private urlCrearMss = environment.api + 'lotes/crear_masivos';

  private urlGetContratos = environment.api + 'contratos';
  private urlGetContrato = environment.api + 'contrato';
  private urlEditContrato = environment.api + 'contratos/editar';
  private urlCrearContrato = environment.api + 'contratos/crear';
  private verContrato = environment.api + 'contratos/obtener/pdf/';
  private urlGetCeldas = environment.api + 'contratos/obtener_celdas/';
  private urlUpdCelda = environment.api + 'contratos/actualizar/celda';
  private urlAddCelda = environment.api + 'contratos/agregar/celda';

  private urlUploadDrive = environment.dominio + 'api/storage/uploadDriveFile.php';
  private urlSaveName = environment.api + 'desarrollos/subir_archivo';
  private urlFilterFiles = environment.api + 'webapp/obtener_documentos_filtrados';
  private urlDeleteFile = environment.api + 'webapp/eliminar_archivo';
  private urlmodificateFile = environment.api + 'webapp/modificar_nombre';
  private urlUpdateFile = environment.api + 'webapp/editar_archivo';
  private urlDelCelda = environment.api + 'contratos/eliminar/celda';
  
  public urlLotes = environment.api + 'lotes/hr/';
  private urlgetTickets = environment.api + 'fx/getTickets'

  constructor(
    private http: HttpClient,
  ) {

  }
  public eliminarCelda(data) {
    return this.http.post(this.urlDelCelda, data);
  }
  public addCelda(data) {
    return this.http.post(this.urlAddCelda, data);
  }
  public actualizarCelda(data) {
    return this.http.post(this.urlUpdCelda, data);
  }
  public obtenerCeldas(id) {
    return this.http.get(this.urlGetCeldas + id);
  }

  public getEmpresas() {
    return this.http.get(this.urlGetEmpresas);
  }

  public getEmpresa(id: any) {
    return this.http.get(this.urlGetEmpresas + '/' + id);
  }

  public updateEmpresa(data: any) {
    return this.http.post(this.urlEditEmpresa, data);
  }

  public createEmpresa(data: any) {
    return this.http.post(this.urlCrearEmpresa, data);
  }

  // Desarrollos
  public getDesarrollos(id: any) {
    return this.http.get(this.urlGetDesarrollos + '/' + id);
  }

  public getDesarrollo(id: any) {
    return this.http.get(this.urlGetDesarrollos + '/by/' + id);
  }

  public guardarDesarrollo(data: any) {
    return this.http.post(this.urlCrearDesarrollo, data);
  }

  public actualizarDesarrollo(data: any) {
    return this.http.post(this.urlEditDesarrollo, data);
  }

  //Etapas
  public getEtapas() {
    return this.http.get(this.urlGetEtapas);
  }

  public crearEtapa(data) {
    return this.http.post(this.urlCrearEtapa, data);
  }

  //Etapas con parametro
  public getEtapa(id: any) {
    return this.http.get(this.urlGetEtapas + '/' + id);
  }

  //lotes
  public getLotes() {
    return this.http.get(this.urlGetLotes);
  }

  public getLoteById(id) {
    return fetch(this.urlGetLotes + '/by/id/' + id).then(res => res.json());
  }

  public guardarLote(data) {
    return this.http.post(this.urlCrearLote, data);
  }

  public guardarLotesMasivo(data) {
    return this.http.post(this.urlCrearMss, data);
  }

  //lotes con parametro
  public getLote(idDes: any, idEtapa: any) {
    return this.http.get(this.urlGetLotes + '/' + idDes + '/' + idEtapa);
  }

  public updateLote(data) {
    return this.http.post(this.urlEditLote, data);
  }

  //contratos
  public getContratos() {
    return this.http.get(this.urlGetContratos);
  }

  public verPdfContrato(id) {
    window.open(this.verContrato + id, 'blank');
  }

  public updateContrato(data) {
    return this.http.post(this.urlEditContrato, data);
  }

  public crearContrato(data) {
    return this.http.post(this.urlCrearContrato, data);
  }

  //Socios
  public getSocios() {
  }

  //Comisiones
  public getComisiones() {
  }

  //Estatus contratos
  public getEstatusComisiones() {
  }

  //Subir archivo del drive
  public uploadDriveFile(formdata) {
    return this.http.post(this.urlUploadDrive, formdata, { responseType: 'text' });
  }

  public saveNameFile(data) {
    return this.http.post(this.urlSaveName, data);
  }

  public obtenerDocumentosFiltrados(data) {
    return this.http.post(this.urlFilterFiles, data);
  }

  public eliminarArchivoDrive(data) {
    return this.http.post(this.urlDeleteFile, data);
  }
  public ModificarNombreArchivo(data) {
    return this.http.post(this.urlmodificateFile, data );
  }

  public editarArchivoDrive(data) {
    return this.http.post(this.urlUpdateFile, data);
  }

  public getLotesHr(desarrollo, etapa) {
    return this.http.get(this.urlLotes + desarrollo + '/' + etapa);
  }

  public getTickets(){
    return this.http.get(this.urlgetTickets);
  }
}
