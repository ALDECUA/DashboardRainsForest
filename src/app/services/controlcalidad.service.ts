import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlcalidadService {

  /* Contratos */
  private urlStatusContratos = environment.api + 'contratos/status/contratos';
  private urlCrearRequisicion = environment.api + 'contratos/fad/requisicion/crear/';
  private urlContratoFirmado = environment.api + 'contratos/fad/requisicion/firmado/';
  private urlResendContrato = environment.api + 'contratos/reenviar/contrato';
  private urlGenerarFad = environment.api + 'contratos/fad/token/obtener';
  private urlFirmado = environment.api + 'contratos/setfirmado';
  private urlgetcontratosbyhr = environment.api + 'contratos/obtener_contrato_por_verificar';
  private urlgetVerificarContratos = environment.api + 'contratos/verificar_contrato';
  private urlVerficarContrato = environment.api + 'contratos/verificar/clausula';
  private urlLlenarCelda = environment.api + 'contratos/llenarcelda';

  /* HR */
  public urlSaveHr = environment.api + 'hr/insertar_hr';
  public urlBusqueda = environment.api + 'hr/BuscarEmail';
  public urlCrearInversionista = environment.api+'hr/crear_inversionistaHR';
  private urlEncuestas = environment.api+'hr/encuestas';
  public urlReagendar = environment.api+'hr/reagendar';
  private encuestasm = environment.api +'hr/encuesta';
  private urlGetEncuestas = environment.api + 'hr/getEncuestas';
  private urlGuardarRespuestas = environment.api + 'hr/guardarEncuesta'
  private urlListar = environment.api + 'hr/personas';
  private urlDatos = environment.api + 'hr/obtener_datos_hr';
  private urlGetUD = environment.api + 'hr/actualizar_status_documentos';
  private urlUdtS = environment.api + 'hr/actualizar_status_hr';
  private urlUdtP = environment.api + 'hr/actualizar_datos_generales_hr';
  private urlUdtB = environment.api + 'hr/actualizar_bono_red';
  private urlCobranza = environment.api + 'hr/cobranza';
  private urlRecordar = environment.api + 'hr/recordar_pago';
  private urlTipoPago = environment.api + 'hr/tipo_pago';
  private urlRegistrarPago = environment.api + 'hr/registrar_pago';
  private urlEliminar = environment.api + 'hr/eliminarHR';
  private urlVerificarDatos = environment.api + 'hr/verificar_pago';
  private urlGetLLamadas = environment.api + 'hr/obtener_llamadas';
  private urlUpdateCita = environment.api + 'hr/cambiar_status_cita';
  private urlReenviarCorreo = environment.api + 'hr/crear_inversionista';
  private urlInvPresistema = environment.api + 'hr/crear_inversionista_simple';
  private urlOrganigrama = environment.api + 'hr/organigrama_id/';
  private urlClientes = environment.api + 'hr/carteraclientes/';
  private urlActualizarote = environment.api + 'hr/actualizar_lotes_del_hr';
  private urlEnviarSms = environment.api + 'hr/enviar_datos_sms';
  private urlHRViejito = environment.api + 'hr/HR_PreSistema/';
  private urlGetInversionistas = environment.api + 'hr/getInversionistas';
  private urlGetLotesInversionistas = environment.api + 'hr/lotes/';
  private urlInvRegistrados = environment.api + 'hr/personas_registradas';
  private urlInvRegistradosPAGOS = environment.api + 'hr/personas_registradasPAGOS';
  private urlFinalizarHR = environment.api + 'hr/concluirHR';
  private urlEnviarContrato = environment.api + 'hr/enviarContrato';
  private urlInsertarLote = environment.api + 'hr/insertar_hr_inv_existente';
  private urlGetUsuariosVerificacion = environment.api + 'hr/verificacion';

  /* EXTRAS */
  private urlAsesores = environment.api + 'reclutamiento/personas_activas';
  private urlNotificacionpwa = environment.api + 'avisos/notificacionsend'
  private urlGetDesarrollos = environment.api + 'desarrollos/1';
  private urlGetEtapas = environment.api + 'fases/';
  private urlLotes = environment.api + 'lotes/';
  private urlGetLotes = environment.api + 'lotes/disponibles/';
  private urlBusquedaInv = environment.api + 'hr/busquedaInv';
  private urlReporteEncuestas = environment.api + 'crm_reportes/reporteEncuestas';



  constructor(
    private http: HttpClient,
  ) { }

  public getStatusContratos() {
    return this.http.get(this.urlStatusContratos);
  }

  public getPersonasHr() {
    return this.http.get(this.urlListar);
  }

  public ReporteEncuestas() {
    return this.http.get(this.urlReporteEncuestas);
  }

  public enviarFADtoSign(idhr) {
    return this.http.post(this.urlCrearRequisicion + idhr, {});
  }

  public generarFADToken() {
    return this.http.get(this.urlGenerarFad);
  }

  public setFirmado(data) {
    return this.http.post(this.urlFirmado, data);
  }
  public getDatosHr(data) {
    return this.http.post(this.urlDatos, data);
  }

  public actualizarStatusArchivos(data) {
    return this.http.post(this.urlGetUD, data);
  }

  public actualizarStatusHr(data) {
    return this.http.post(this.urlUdtS, data);
  }

  public actualizarDatosGeneralesHr(data) {
    return this.http.post(this.urlUdtP, data);
  }

  public actualizarBonoRed(data) {
    return this.http.post(this.urlUdtB, data);
  }

  public getPagosCobranza() {
    return this.http.get(this.urlCobranza);
  }

  public getRecordarContrato(data) {
    return this.http.post(this.urlRecordar, data);
  }
  public getTipoPago() {
    return this.http.get(this.urlTipoPago);
  }
  public registrarPago(data) {
    return this.http.post(this.urlRegistrarPago, data);
  }
  public eliminarHr(dato) {
    return this.http.post(this.urlEliminar, dato);
  }

  public getContratoFirmado(id) {
    return this.http.get(this.urlContratoFirmado + id);
  }

  public verificarPago(dato) {
    return this.http.post(this.urlVerificarDatos, dato);
  }

  public reenviarContrato(data) {
    return this.http.post(this.urlResendContrato, data);
  }
  public getLlamadas() {
    return this.http.get(this.urlGetLLamadas);
  }
  public actualizarCita(dato) {
    return this.http.post(this.urlUpdateCita, dato);
  }
  public reenviarcorreo(dato) {
    return this.http.post(this.urlReenviarCorreo, dato);
  }
  public getDesarrollos() {
    return this.http.get(this.urlGetDesarrollos);
  }
  public getEtapas(Desarrollo) {
    return this.http.get(this.urlGetEtapas + Desarrollo);
  }
  public getLotes(Desarrollo, Etapa) {
    return this.http.get(this.urlGetLotes + Desarrollo + '/' + Etapa);
  }
  public getLotesT(Desarrollo, Etapa) {
    return this.http.get(this.urlLotes + Desarrollo + '/' + Etapa);
  }
  public ActualizarLoteHR(Lote) {
    return this.http.post(this.urlActualizarote, Lote);
  }
  public enviarSMS(datos) {
    return this.http.post(this.urlEnviarSms, datos);
  }
  public HR_Old(IdHR) {
    return this.http.get(this.urlHRViejito + IdHR)
  }
  public getInversionistas() {
    return this.http.get(this.urlGetInversionistas);
  }
  public getLotesInversionista(Id) {
    return this.http.get(this.urlGetLotesInversionistas + Id);
  }
  public getRegistrosInversionistas() {
    return this.http.get(this.urlInvRegistrados);
  }
  public getRegistrosInversionistasPAGOS() {
    return this.http.get(this.urlInvRegistradosPAGOS);
  }
  public FinalizarHR(data) {
    return this.http.post(this.urlFinalizarHR, data);
  }
  public EnviarContrato(data) {
    return this.http.post(this.urlEnviarContrato, data);
  }
  public insertarLoteHr(data) {
    return this.http.post(this.urlInsertarLote, data);
  }
  public obtenerverificacion() {
    return this.http.get(this.urlGetUsuariosVerificacion);
  }
  public obtenercontratoshr(data) {
    return this.http.get(this.urlgetcontratosbyhr + '/' + data);
  }
  public verificarContratosStatus(data) {
    return this.http.post(this.urlgetVerificarContratos, data);
  }
  public verificarClausulasContrato(data) {
    return this.http.post(this.urlVerficarContrato, data);
  }
  public llenarCelda(data) {
    return this.http.post(this.urlLlenarCelda, data);
  }
  public getAsesores() {
    return this.http.get(this.urlAsesores);
  }
  public getOrganigrama(id){
    return this.http.get(this.urlOrganigrama + id);
  }
  public getClientes(id) {
    return this.http.get(this.urlClientes + id);
  }
  //hr
  public guardarHR(data) {
    return this.http.post(this.urlSaveHr, data);
  }

  public busqueda(data){
    return this.http.post(this.urlBusqueda, data);
  }
  public crearInversionista(data)
  {
    return this.http.post(this.urlCrearInversionista,data);
  }
  public Notificacionpwa(data)
  {
    return this.http.post(this.urlNotificacionpwa,data);
  }
  public getEncuestas(){
    return this.http.get(this.urlEncuestas);
  }
  public reagendar(data){
    return this.http.post(this.urlReagendar,data);
  }
  public modificarencuesta(data){
    return this.http.post(this.encuestasm,data);
  }
  public obtenerEncuestas(){
    return this.http.get(this.urlGetEncuestas);
  }
  public guardarEncuesta(data){
    return this.http.post(this.urlGuardarRespuestas, data)
  }
  public busquedaInv(data){
    return this.http.post(this.urlBusquedaInv,data)
  }
  public InvPresistema(data){
    return this.http.post(this.urlInvPresistema,data)
  }
}
