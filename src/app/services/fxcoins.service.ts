import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FxcoinsService {
  private urlGetProductos = environment.api + 'fxcoins/obtener_productos_fx';
  private urlGetProducto = environment.api + 'fxcoins/producto/';
  private urlUdtProducto = environment.api + 'fxcoins/producto/editar';
  private urlGetPedidos = environment.api + 'pedidos/listar';
  private urlGetTop = environment.api + 'pedidos/top';
  private urlGetLast = environment.api + 'pedidos/last';
  private urlGetStatus = environment.api + 'pedidos/status';
  private urlGetEstadisticas = environment.api + 'pedidos/estadisticas';
  private urlGetPedido = environment.api + 'pedidos/pedido/';
  private urlUpdtStatus = environment.api + 'pedidos/updatestatus';
  private urlAsignarFxCoins = environment.api + 'fxcoins/asignarFxCoins';
  private urlAgregarProducto = environment.api + 'fxcoins/producto/guardar';
  private urlSubirFotoProducto = environment.dominio+'api/storage/subirfoto_producto.php';
  private urlGetRanking = environment.api + 'fxcoins/obtener_rankingfxc';
  private urlSendRanking = environment.api + 'fxcoins/reporte_coins';
  private urlGetReporteGeneral = environment.api + 'fxcoins/reporte_fxc';
  private urlGenerarReporteGeneral = environment.api + 'fxcoins/reporte_global'
  private urlListarPersonas = environment.api + 'reclutamiento/personasfxcoins';
  private urlsendRecibo = environment.api + 'fxcoins/reciboCustom';
  private ulrconvatexto =  environment.api + 'fxcoins/numeroTexto';
  @Output() disparadorRecibo: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) { }

  public getProductos() {
    return this.http.get(this.urlGetProductos);
  }

  public getProducto(id) {
    return this.http.get(this.urlGetProducto + id);
  }

  public updateProducto(data) {
    return this.http.post(this.urlUdtProducto, data);
  }

  public getPedidos() {
    return this.http.get(this.urlGetPedidos);
  }

  public getVentasTop() {
    return this.http.get(this.urlGetTop);
  }

  public getPedidosStatus() {
    return this.http.get(this.urlGetStatus);
  }

  public getLastPedidos() {
    return this.http.get(this.urlGetLast);
  }

  public getEstadisticas() {
    return this.http.get(this.urlGetEstadisticas);
  }

  public getPedido(id) {
    return this.http.get(this.urlGetPedido + id);
  }

  public updateStatusPedido(data) {
    return this.http.post(this.urlUpdtStatus, data);
  }
  public AsignarFxCoins(data) {
    return this.http.post(this.urlAsignarFxCoins, data);
  }
  public AgregarProducto(data) {
    return this.http.post(this.urlAgregarProducto, data);
  }
  public SubirFotoProducto(data) {
    return this.http.post(this.urlSubirFotoProducto, data, { responseType: 'text' });
  }
  public getRankin() {
    return this.http.get(this.urlGetRanking);
  }
  public enviarReporte(data) {
    return this.http.post(this.urlSendRanking, data, { responseType: 'blob' });
  }
  public getInfoReporte() {
    return this.http.get(this.urlGetReporteGeneral);
  }
  public getReporteGeneral(data) {
    return this.http.post(this.urlGenerarReporteGeneral, data, { responseType: 'blob' });
  }
  public getPersonas() {
    return this.http.get(this.urlListarPersonas);
  }
  public sendRecibos(data){
    return this.http.post(this.urlsendRecibo, data);
  }
  public convertirTexto(data){
    return this.http.post(this.ulrconvatexto, data);
  }
}
