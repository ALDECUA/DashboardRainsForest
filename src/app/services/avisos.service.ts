import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AvisosService {
  public urlsubirArte = environment.dominio + 'api/storage/subirpromo.php';
  public urlupimg= environment.dominio + 'api/storage/subirimgnotificacion.php'
  public urlNuevaPromo = environment.api + 'avisos/nueva_promo';
  public urlpromos = environment.api+'avisos/promos'
  public urlnotificacionimg = environment.api+'avisos/notificacionimg'
  public urlPromo = environment.api+'avisos/promo';
  public urlnotificacionsend = environment.api+'avisos/notificacionsend';
  public urlAgendanotifiacion = environment.api+'avisos/notificacionagenda';
  public urlgetnotificaciones = environment.api+'avisos/getnotificaciones';
  public urleliminarmensaje = environment.api+'avisos/eliminarmensaje';
  constructor(public http: HttpClient) {}
  public subirArte(data) {
    return this.http.post(this.urlsubirArte, data);
  }
  public NuevaPromo(data) {
    return this.http.post(this.urlNuevaPromo, data);
  }
  public promos()
  {
    return this.http.get(this.urlpromos);
  }
  public promo(data){
    return this.http.post(this.urlPromo,data); 
  }
  public Agendanotifiacion(data){
    return this.http.post(this.urlAgendanotifiacion,data); 
  }
  public notificacionsend(data) {
    return this.http.post(this.urlnotificacionsend, data);
  }
  public upimg(formdata){
    return this.http.post(this.urlupimg,formdata ,{ responseType: 'text' })
  }
  public notifiaccionimg(data){
    return this.http.post(this.urlnotificacionimg,data )
  }
  public getnotificaciones(data){
    return this.http.get(this.urlgetnotificaciones,data )
  }
  public eliminarmensaje(data){
    return this.http.post(this.urleliminarmensaje,data )
  }
}
