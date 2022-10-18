import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosCrmService {
   private urlIP= environment.api+"crm_usuarios/crear_usuarios";
   private urlGetPer= environment.api+"crm_usuarios/listar_usuarios";
   private ulrLTipoU =environment.api+"crm_usuarios/listar_tipousuarios";
   private urlObtenerUsuarioId= environment.api+"crm_usuarios/obtener_usuario_por_id";
   private urlEditarUsuario= environment.api+"crm_usuarios/editar_usuarios";
   private urlObtenerPerfiles= environment.api+"crm_usuarios/listar_perfiles";
   private urlcrearPerfil= environment.api+"crm_usuarios/crear_perfil";
   private urlFiltrarPerfilId= environment.api+"crm_usuarios/obtener_perfil_por_id";
   private urlEditarPerfil= environment.api+"crm_usuarios/editar_perfiles";
   private urlVerMenus= environment.api+"crm_usuarios/listar_menus";
   private urlVerMenusId= environment.api+"crm_usuarios/menu_id";
   private urlObtenerNiveles= environment.api+"crm_reportes/ObtenerNiveles";
   private urlInsertarColumna= environment.api+"crm_reportes/InsertarColumna/";
   private urlEliminarColumna= environment.api+"crm_reportes/EliminarColumna/";
   
   private urlInsertarComisiones= environment.api+"crm_reportes/InsertarComisiones";
   private urlInsertarnuevonivel= environment.api+"crm_reportes/InsertarNuevoNivel";
   private urlEditarPermisos= environment.api+"crm_usuarios/permisos_perfil";
   constructor( private http: HttpClient) {
   }
  
  public crearPerfiles(data) {
    return this.http.post(this.urlIP,data);
  }
  public listarPerfiles() {
    return this.http.get(this.urlGetPer);
  }
  
  public Insertarnuevonivel(data)
  {
    return this.http.post(this.urlInsertarnuevonivel,data);
  }
  public InsertarComisiones(data)
  {
    return this.http.post(this.urlInsertarComisiones,data);
  }
  public ObtenerNiveles() {
    return this.http.get(this.urlObtenerNiveles);
  }
  public InsertarColumna(i) {
    return this.http.get(this.urlInsertarColumna+i);
  }
  public EliminarColumna(i) {
    return this.http.get(this.urlEliminarColumna+i);
  }
  

  public listarTipoUsuario()
  {
    return this.http.get(this.ulrLTipoU);
  }
  public UsuarioPorId(data)
  {
    return this.http.post(this.urlObtenerUsuarioId,data);
  }
  public EditarUsuario(data)
  {
    return this.http.post(this.urlEditarUsuario,data);
  }
  public ObtenerPerfiles(data)
  {
    return this.http.post(this.urlObtenerPerfiles,data);
  }
  public CrearPerfil(data)
  {
    return this.http.post(this.urlcrearPerfil,data);
  }
  public PerfilPorId(data)
  {
    return this.http.post(this.urlFiltrarPerfilId,data);
  }
  public EditarPerfil(data)
  {
    return this.http.post(this.urlEditarPerfil,data);
  }
  public ListarMenus()
  {
    return this.http.get(this.urlVerMenus);
  }
  public ListarMenusId(data)
  {
    return this.http.post(this.urlVerMenusId,data);
  }
  public EditarPermisos(data)
  {
    return this.http.post(this.urlEditarPermisos,data);
  }
}
