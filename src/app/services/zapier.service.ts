import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZapierService {
  private urlprospectos = environment.api + 'zap_prospectos/ObtenerProspectos';
  private urlformulario = environment.api + 'zap_prospectos/formulario';
  private urldatamenus = environment.api + 'zap_prospectos/menus';
  private urlSC = environment.api + 'zap_prospectos/SociosComerciales';
  private urlObtenerAsignados = environment.api + 'zap_prospectos/ObtenerAsigandos';
  //Seccion de inserts
  private urlAsignarProspectos = environment.api + 'zap_prospectos/AsignarProspectos';
  private urlinsertgrupos = environment.api + 'zap_prospectos/insertgrupos';
  private urlGetprospecto = environment.api + 'zap_prospectos/ProspectoId';
  private urlReasignar = environment.api + 'zap_prospectos/Reasignacion';
  private urlInsertPasos = environment.api + 'zap_prospectos/insertarPasos';
  private urlVerpasomensaje = environment.api + 'zap_prospectos/ListarSistema';
  private urlUpdatePasos = environment.api + 'zap_prospectos/UpdatePasos';
  private urlInsertMensajes = environment.api + 'zap_prospectos/insertarMensaje';
  private urlUpfateMensajes = environment.api + 'zap_prospectos/UpdateMensajes';
  private urlInsertarExcel = environment.api + 'contabilidad/excelLead';

  private urlrecordatorio = environment.api + 'avisos/notificacionsend';

  @Output() disparadorForm: EventEmitter<any> = new EventEmitter();

  @Output() disparadorFormModal: EventEmitter<any> = new EventEmitter();

  @Output() disparadorProcesos: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) { }

  public verformulario(data){
    return this.http.post(this.urlformulario,data); 
  }
  public recordatorio(data){
    return this.http.post(this.urlrecordatorio,data); 
  }
  
  public datamenus(){
    return this.http.get<any>(this.urldatamenus);
  }
  public listarProspectos(){
    return this.http.get<any>(this.urlprospectos);
  }
  public ListarSociosComerciales(){
    return this.http.get(this.urlSC);
  }
  public ObtenerAsigandos(datos){
    return this.http.post(this.urlObtenerAsignados,datos);
  }
  public ObtenerLeadId(id){
    return this.http.get(this.urlGetprospecto + '/' + id);
  }
  public ObtenerSistema(data){
    return this.http.post(this.urlVerpasomensaje, data);
  }

  public InsertarExcel(data){
    return this.http.post(this.urlInsertarExcel,data)
  }
  //inserts
  public AsignarLead(data){
      return this.http.post(this.urlAsignarProspectos, data);
  }

  public insertGrupos(data){
    return this.http.post(this.urlinsertgrupos,data);
  }
  
  public ReasignarLead(data){
    return this.http.post(this.urlReasignar, data);
  }

  public InsertarPasos(data){
    return this.http.post(this.urlInsertPasos, data);
  }

  public InsertarMensajes(data){
    return this.http.post(this.urlInsertMensajes, data);
  }

  //Update

  public UpdatePasos(data){
    return this.http.post(this.urlUpdatePasos, data);
  }
  public UpdateMensajes(data){
    return this.http.post(this.urlUpfateMensajes, data);
  }

  
}
